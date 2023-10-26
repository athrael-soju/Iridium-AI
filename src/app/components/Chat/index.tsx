import 'regenerator-runtime/runtime';

import React, { ChangeEvent, useEffect, useRef } from 'react';
import Messages from './Messages';
import { Message } from 'ai/react';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { DARK_BG_COLOR_HEX } from '@/constants';

const appId: string = 'df9e9323-8c5d-43c6-a215-f1c6084091f8';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

interface ChatProps {
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  messages: Message[];
  isLoading: boolean;
}

const Chat: React.FC<ChatProps> = ({
  handleInputChange,
  messages,
  isLoading,
}) => {
  const { transcript } = useSpeechRecognition();
  const handleInputChangeRef = useRef(handleInputChange);

  useEffect(() => {
    if (transcript) {
      handleInputChangeRef.current({
        target: { value: transcript },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [transcript]);

  return (
    <div
      style={{
        backgroundColor: DARK_BG_COLOR_HEX,
      }}
    >
      <Messages messages={messages} isLoading={isLoading} />
    </div>
  );
};

export default Chat;
