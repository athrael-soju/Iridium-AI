import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import {
  Cog8ToothIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';
import { ActionIcon } from '@/components';
import User from '@/components/Login/User';
import iridiumAILogo from '../../../../public/iridium-ai.svg';
import DeployBtn from './DeployBtn';
import styles from './styles.module.css';

export default function Header() {
  const { setValue, watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');
  const showContext = watch('showContext');
  const setWebSpeechEnabled = (value: boolean) => {
    setValue('isWebSpeechEnabled', value);
  };

  const setShowContext = (value: boolean) => setValue('showContext', value);

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
