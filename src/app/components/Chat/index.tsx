import 'regenerator-runtime/runtime';

import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
  useRef,
} from 'react';
import { Input } from 'antd';
import { useFormContext } from 'react-hook-form';
import Messages from './Messages';
import { Message } from 'ai/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import WebSpeechBtn from '../Header/WebSpeechBtn';

const appId: string = 'df9e9323-8c5d-43c6-a215-f1c6084091f8';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

interface ChatProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
}

const Chat: React.FC<ChatProps> = ({
  input,
  handleInputChange,
  handleMessageSubmit,
  messages,
  isLoading,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const { transcript } = useSpeechRecognition();
  const handleInputChangeRef = useRef(handleInputChange);

  const { setValue, watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');

  useEffect(() => {
    if (transcript) {
      handleInputChangeRef.current({
        target: { value: transcript },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [transcript]);

  const startListening = () => {
    SpeechRecognition.startListening();
  };
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsRecording(false);
  };

  const toggleListening = async () => {
    if (isRecording) {
      stopListening();
      if (input) {
        await handleMessageSubmit(
          new Event('submit') as unknown as FormEvent<HTMLFormElement>
        );
        setValue('isSpeechStopped', false);
      }
    } else {
      startListening();
    }
    setIsRecording(!isRecording);
  };

  // Extracted the nested ternary operation into a separate variable
  const recordButtonTitle = () => {
    if (isWebSpeechEnabled && !isRecording) return 'Record a Message';
    if (isWebSpeechEnabled && isRecording) return 'Send Message';
    return 'Enable Web Speech to Record a Message';
  };

  return (
    <div id="chat" className="flex flex-col w-full lg:w-3/5 px-2 flex-grow">
      <Messages messages={messages} isLoading={isLoading} />
      <form
        onSubmit={handleMessageSubmit}
        className="mt-5 mb-2 relative bg-gray-700 rounded-lg"
      >
        <Input
          size="large"
          type="text"
          value={input}
          onChange={handleInputChange}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          Send Message ⮐
          <div>
            <button
              type="button"
              className={`ml-2 ${
                isWebSpeechEnabled
                  ? 'text-gray-400 animate-pulse-once'
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              onClick={toggleListening}
              disabled={!isWebSpeechEnabled}
              title={recordButtonTitle()} // Used the extracted logic here
            >
              <FontAwesomeIcon icon={faMicrophone} fade={isRecording} />
            </button>
            <WebSpeechBtn stopSpeaking={stopSpeaking} />
          </div>
        </span>
      </form>
    </div>
  );
};

export default Chat;
