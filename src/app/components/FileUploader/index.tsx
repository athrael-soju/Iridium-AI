import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FilePond, registerPlugin } from 'react-filepond';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import type { ContextFormValues } from '../Context/types';
import { Button, message, Upload } from 'antd';
import type { UploadProps } from 'antd';
import styles from './styles.module.css';

import useProcessFile from './useProcessFile';

interface FileUploaderProps {
  namespace: any;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ namespace }) => {
  const { setValue, watch } = useFormContext<ContextFormValues>();
  const processFile = useProcessFile({ namespace });

  const props: UploadProps = {
    name: 'file',
    showUploadList: false,
    beforeUpload: (file) => {
      return false;
    },
    onChange(info) {
      processFile(info.file);
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...props}>
      <CloudArrowUpIcon className={styles.uploadSvg} />
    </Upload>
  );
};

export default FileUploader;
