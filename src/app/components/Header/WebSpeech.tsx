'use client';

import { useState } from 'react';
import { Button, Tooltip, Space } from 'antd';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeMute,
  faVolumeUp,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .ant-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    display: block;
    width: 100%;
    height: 18px;
    fill: currentColor;
  }
`;

const WebSpeech = () => {
  const [isFading, setIsFading] = useState(false);
  const { setValue, watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');

  const handleVoiceClick = () => {
    setIsFading(true);
    setValue('isWebSpeechEnabled', !isWebSpeechEnabled);
    setTimeout(() => setIsFading(false), 820); // Turn off animation after 820 ms
  };

  return (
    // <button
    //   onClick={handleVoiceClick}
    //   title={isWebSpeechEnabled ? 'Disable Web Speech' : 'Enable Web Speech'}
    // >
    //   <FontAwesomeIcon
    //     icon={isWebSpeechEnabled ? faVolumeUp : faVolumeMute}
    //     size="2x"
    //     fade={isFading}
    //     style={{ color: 'white' }}
    //   />
    // </button>

    <Container>
      <Button
        type="primary"
        icon={
          isWebSpeechEnabled ? (
            <SpeakerWaveIcon color="white" />
          ) : (
            <SpeakerXMarkIcon />
          )
        }
        onClick={handleVoiceClick}
      />
    </Container>
  );
};

export default WebSpeech;
