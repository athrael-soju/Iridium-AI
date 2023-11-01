import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios, { AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { message } from 'antd';
import type {
  UploadFileStatus,
  // UploadListProgressProps,
} from 'antd/es/upload/interface';
import type { UploadProps } from 'antd';
import type { ContextFormValues } from '../Context/types';

const useUploadProps = ({ namespace }: { namespace: string }) => {
  const { setValue, watch } = useFormContext<ContextFormValues>();
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState<UploadFileStatus>();
  const [fileName, setFileName] = useState<string>('');
  const splittingMethod = watch('splittingMethod');
  const chunkSize = watch('chunkSize');
  const overlap = watch('overlap');

  const processFile = useCallback(
    (file: any) => {
      const options = {
        splittingMethod,
        chunkSize,
        overlap,
        namespace,
      };
      let formData = new FormData();
      formData.set('file', file);
      setStatus('uploading');

      const config: AxiosRequestConfig = {
        onUploadProgress: function (e: AxiosProgressEvent) {
          const total = e?.total ?? 0;
          const percentCompleted = Math.round((e.loaded * 100) / total) - 20;
          setPercent(percentCompleted);
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      axios
        .post('/api/upload', formData, config)
        .then(async function () {
          const filename = file?.name;
          message.success('File Uploaded Successfully');

          setFileName((prev) => prev + ' - Uploaded');

          const ingestResponse = await axios.post('/api/ingest', {
            filename,
            options,
          });

          if (ingestResponse.status >= 200 && ingestResponse.status < 300) {
            const { documents } = await ingestResponse.data;
            message.success('File Ingested Successfully');
            setFileName((prev) => prev.replace(' - Uploaded', ' - Ingested'));
            setValue('cards', documents);
            setPercent(100);
            setStatus('done');
            setTimeout(() => {
              setFileName('');
            }, 2000);
          } else {
            message.error('File Ingest Failed');
            throw new Error('File Ingest Failed');
          }
        })
        .catch(function () {
          message.error('File Upload Failed');
          throw new Error('File Upload Failed');
        });

      return {
        abort: () => {
          // axios does not provide an abort method, so we leave this empty
        },
      };
    },
    [setValue, splittingMethod, chunkSize, overlap, namespace]
  );

  // const progress: UploadListProgressProps = {
  //   strokeColor: {
  //     '0%': '#108ee9',
  //     '100%': '#87d068',
  //   },
  //   size: 3,
  //   strokeWidth: 3,
  //   format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
  // };

  const props: UploadProps = {
    name: 'file',
    className: fileName && 'upload-item-added',
    showUploadList: {
      showRemoveIcon: false,
      showDownloadIcon: false,
    },
    fileList: fileName
      ? [
          {
            uid: '1',
            name: fileName,
            status,
            percent: percent,
          },
        ]
      : [],
    maxCount: 1,
    beforeUpload: () => {
      return false;
    },
    onChange(info) {
      setFileName(info.file.name);
      processFile(info.file);

      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    // progress,
  };

  return props;
};

export default useUploadProps;
