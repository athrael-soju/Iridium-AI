import Image from 'next/image';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeMute,
  faVolumeUp,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import User from '@/components/Login/User';
import iridiumAILogo from '../../../../public/iridium-ai.svg';
import DeployBtn from './DeployBtn';
import styles from './styles.module.css';

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
    <div>
      <header className={styles.header}>
        <div className="logo-container">
          <Image
            src={iridiumAILogo}
            className={styles.logo}
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
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <button
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
          </button>
          <button
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
          </button>
          <User />
        </div>
      </header>
      <style jsx>{`
        .logo-container {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        button {
          display: flex;
          align-items: center;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
