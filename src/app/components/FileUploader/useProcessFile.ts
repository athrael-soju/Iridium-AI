import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import axios, { AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { message } from 'antd';
import type { ContextFormValues } from '../Context/types';

const useFileProcessor = ({ namespace }: { namespace: string }) => {
  const { setValue, watch } = useFormContext<ContextFormValues>();
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

      const config: AxiosRequestConfig = {
        onUploadProgress: function (e: AxiosProgressEvent) {
          // const total = e?.total ?? 0;
          // const percentCompleted = Math.round((e.loaded * 100) / total);
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      axios
        .post('/api/upload', formData, config)
        .then(async function (response) {
          const filename = file.name;
          message.success('File Uploaded Successfully');
          const ingestResponse = await axios.post('/api/ingest', {
            filename,
            options,
          });

          if (ingestResponse.status >= 200 && ingestResponse.status < 300) {
            const { documents } = await ingestResponse.data;
            message.success('File Ingested Successfully');
            setValue('cards', documents);
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

  return processFile;
};

export default useFileProcessor;
