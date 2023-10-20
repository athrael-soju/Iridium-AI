'use client';

import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { Button, Tooltip, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
// import User from '@/components/Login/User';
import iridiumAILogo from '../../../../public/iridium-ai.svg';
import WebSpeech from './WebSpeech';

import User from './User';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  svg {
    display: block;
    width: 100%;
    fill: currentColor;
  }
`;

const RightSide = () => {
  const { setValue } = useFormContext();

  return (
    <Container>
      <WebSpeech />
      <Button
        type="primary"
        icon={<SettingOutlined />}
        onClick={() => setValue('isModalOpen', true)}
      />
      <User />
    </Container>
  );
};

export default RightSide;
