import React, { FC } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Button } from 'antd';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';

export interface IUrlEntry {
  url: string;
  title: string;
  seeded: boolean;
  loading: boolean;
}

interface IURLButtonProps {
  entry: IUrlEntry;
  onClick: () => Promise<void>;
}

const Container = styled.div`
  display: flex;
  gap: 1rem;

  .ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .ant-btn-icon {
    margin: 0 !important;
  }

  .ant-btn-block {
    width: 100% !important;
  }

  .ant-btn-loading {
    margin-right: 10px !important;
  }
`;

const UrlButton: FC<IURLButtonProps> = ({ entry, onClick }) => (
  <Container>
    <Button
      block
      loading={entry.loading}
      onClick={onClick}
      style={{ width: '100% !important' }}
    >
      Crawl
    </Button>
    <Button icon={<HiArrowTopRightOnSquare />} onClick={onClick}>
      <Link href={entry.url} target="_blank" />
    </Button>
  </Container>
);

export default UrlButton;
