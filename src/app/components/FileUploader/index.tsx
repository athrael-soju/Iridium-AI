import React from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Upload, Tooltip } from 'antd';
import styled from 'styled-components';
import useProcessFile from './useProcessFile';

interface FileUploaderProps {
  namespace: any;
}

const Container = styled.div`
  .uploadSvg {
    position: absolute;
    left: 15px;
    bottom: 18.5px;
    cursor: pointer;
    color: gray;
    width: 21px;
    height: auto;
    z-index: 1;
  }

  .ant-upload-wrapper {
    color: #fff !important;
    display: block !important;
    margin-bottom: 20px !important;
  }

  .ant-upload-list-item-name {
    padding: 0 !important;
  }

  .ant-upload-icon {
    display: none !important;
  }
`;

export const FileUploader: React.FC<FileUploaderProps> = ({ namespace }) => {
  const props = useProcessFile({ namespace });

  return (
    <Container>
      <Upload {...props}>
        <Tooltip title="Upload file for ingestion and processing into the database">
          <CloudArrowUpIcon className="uploadSvg" />
        </Tooltip>
      </Upload>
    </Container>
  );
};

export default FileUploader;
