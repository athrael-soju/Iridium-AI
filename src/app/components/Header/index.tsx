import { useState } from 'react';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { Drawer, Grid } from 'antd';
import {
  Cog8ToothIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { ActionIcon } from '@/components';
import User from '@/components/Login/User';
import { BG_COLOR_HEX } from '@/constants';
import iridiumAILogo from '../../../../public/iridium-ai.svg';
import DeployBtn from './DeployBtn';
import styles from './styles.module.css';

const { useBreakpoint } = Grid;

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { setValue, watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');
  const showContext = watch('showContext');
  const setWebSpeechEnabled = (value: boolean) => {
    setValue('isWebSpeechEnabled', value);
  };

  const setShowContext = (value: boolean) => setValue('showContext', value);
  const screens = useBreakpoint();
  const isMobile = screens.xs;

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
        {isMobile ? (
          <ActionIcon
            icon={Bars3Icon}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <ActionIcon
              icon={isWebSpeechEnabled ? SpeakerWaveIcon : SpeakerXMarkIcon}
              onClick={() => {
                setWebSpeechEnabled(!isWebSpeechEnabled);
              }}
              title={
                isWebSpeechEnabled ? 'Disable Web Speech' : 'Enable Web Speech'
              }
            />
            <ActionIcon
              icon={Cog8ToothIcon}
              onClick={() => {
                setShowContext(!showContext);
              }}
              title="Settings"
            />
            <User />
          </div>
        )}
        <Drawer
          open={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          width={150}
          style={{ backgroundColor: BG_COLOR_HEX, position: 'relative' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              color: '#fff',
              gap: '50px',
              height: '100%',
            }}
          >
            <User />
            <ActionIcon
              icon={Cog8ToothIcon}
              onClick={() => {
                setShowContext(!showContext);
              }}
              title="Settings"
            />
            <ActionIcon
              icon={isWebSpeechEnabled ? SpeakerWaveIcon : SpeakerXMarkIcon}
              onClick={() => {
                setWebSpeechEnabled(!isWebSpeechEnabled);
              }}
              title={
                isWebSpeechEnabled ? 'Disable Web Speech' : 'Enable Web Speech'
              }
            />
          </div>
        </Drawer>
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
