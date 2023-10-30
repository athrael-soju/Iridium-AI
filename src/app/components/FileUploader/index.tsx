import React from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Upload, Tooltip } from 'antd';
import useUploadProps from './useUploadProps';

interface FileUploaderProps {
  namespace: any;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ namespace }) => {
  const props = useUploadProps({ namespace });

  return (
    <div className="container">
      <Upload {...props}>
        <Tooltip title="Upload file for ingestion and processing into the database">
          <CloudArrowUpIcon className="uploadSvg" />
        </Tooltip>
      </Upload>
      <style jsx>{`
        // https://github.com/vercel/styled-jsx?tab=readme-ov-file#one-off-global-selectors
        .container :global(.uploadSvg) {
          position: absolute;
          left: 15px;
          bottom: 18.5px;
          cursor: pointer;
          color: gray;
          width: 21px;
          height: auto;
          z-index: 1;
        }

        .container :global(.ant-upload-wrapper) {
          color: #fff !important;
          display: block !important;
          margin-bottom: 20px !important;
        }

        .container :global(.ant-upload-list-item-name) {
          padding: 0 !important;
        }

        .container :global(.ant-upload-icon) {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default FileUploader;
