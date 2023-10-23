'use client';

import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeMute,
  faVolumeUp,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import User from '@/components/Login/User';
import { BG_COLOR_HEX } from '@/constants';
import iridiumAILogo from '../../../../public/iridium-ai.svg';
import DeployBtn from './DeployBtn';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  color: #fff;
  height: 64px;
  padding-inline: 20px;
  line-height: 64px;
  background-color: ${BG_COLOR_HEX};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  text-align: center;
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  img {
    height: 100%;
    width: auto;
    max-width: 200px;
    cursor: pointer;
  }

  svg {
    font-size: 1rem;
    transform: translateY(6px);
  }
`;

export default function Header() {
  const [isGearSpinning, setIsGearSpinning] = useState(false);
  const { setValue, watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');
  const showContext = watch('showContext');
  const setWebSpeechEnabled = (value: boolean) => {
    setValue('isWebSpeechEnabled', value);
  };

  const setShowContext = (value: boolean) => setValue('showContext', value);

  const handleGearClick = () => {
    setIsGearSpinning(true);
    setShowContext(!showContext);
    setTimeout(() => setIsGearSpinning(false), 1000); // Turn off spin after 1 second
  };

  return (
    <StyledHeader>
      <LogoContainer>
        <Image
          src={iridiumAILogo}
          alt="iridium-logo"
          onClick={() => {
            window.open(
              'https://github.com/athrael-soju/iridium-ai',
              '_blank',
              'noopener noreferrer'
            );
          }}
        />
        <DeployBtn />
      </LogoContainer>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <Suspense fallback={<p>Loading feed...</p>}>
          <Button
            onClick={() => {
              setWebSpeechEnabled(!isWebSpeechEnabled);
            }}
            title={
              isWebSpeechEnabled ? 'Disable Web Speech' : 'Enable Web Speech'
            }
          >
            <FontAwesomeIcon
              icon={isWebSpeechEnabled ? faVolumeUp : faVolumeMute}
              size="2x"
              style={{ color: 'white' }}
            />
          </Button>
          <Button
            onClick={() => {
              const contextWrapper = document.getElementById('contextWrapper');
              if (contextWrapper instanceof HTMLElement) {
                const isHidden =
                  contextWrapper.style.transform === 'translateX(110%)';
                contextWrapper.style.transform = isHidden
                  ? 'translateX(0%)'
                  : 'translateX(110%)';
              }
              handleGearClick();
            }}
            title="Settings"
          >
            <FontAwesomeIcon
              icon={faGear}
              size="2x"
              spin={isGearSpinning}
              style={{ color: 'white' }}
            />
          </Button>
          <User />
        </Suspense>
      </div>
    </StyledHeader>
  );
}
