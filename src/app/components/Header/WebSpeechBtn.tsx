'use client';

import { useFormContext } from 'react-hook-form';
import { faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WebSpeechBtn = ({ stopSpeaking }: any) => {
  const { watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');

  return (
    <button
      type="button"
      className={`ml-2 ${
        isWebSpeechEnabled
          ? 'text-gray-400 animate-pulse-once'
          : 'text-gray-500 cursor-not-allowed'
      }`}
      onClick={stopSpeaking}
      disabled={!isWebSpeechEnabled}
      title={
        isWebSpeechEnabled
          ? 'Stop Message'
          : 'Enable Web Speech to Stop ongoing Messages'
      }
    >
      <FontAwesomeIcon icon={faStop} />
    </button>
  );
};

export default WebSpeechBtn;
