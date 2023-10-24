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

const LinkContainer = styled.div`
  a {
    display: flex;
    align-items: center;
    border: 1px solid #fff;
    border-radius: 4px;
    padding: 0 0.35rem;
    height: 100%;
  }

  svg {
    color: #fff;
    font-size: 1rem;
  }
`;

const truncateTitle = (title: string) => {
  return title.length > 30 ? `'${title.slice(0, 30)}...'` : `'${title}'`;
};

const UrlButton: FC<IURLButtonProps> = ({ entry, onClick }) => (
  <Container>
    <Button
      block
      loading={entry.loading}
      onClick={onClick}
      style={{ width: '100% !important' }}
    >
      Crawl {truncateTitle(entry.title)}
    </Button>
    <LinkContainer>
      <Link href={entry.url} target="_blank">
        <HiArrowTopRightOnSquare />
      </Link>
    </LinkContainer>
  </Container>
);

export default UrlButton;
