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
  .ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
`;

const UrlButton: FC<IURLButtonProps> = ({ entry, onClick }) => (
  <Container>
    <Button
      icon={<HiArrowTopRightOnSquare />}
      loading={entry.loading}
      onClick={onClick}
    >
      <Link href={entry.url} target="_blank">
        {entry.title}
      </Link>
    </Button>
  </Container>
);

export default UrlButton;
