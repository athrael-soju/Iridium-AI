import 'regenerator-runtime/runtime';

import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
  useRef,
} from 'react';
import Messages from './Messages';
import { Message } from 'ai/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const appId: string = 'df9e9323-8c5d-43c6-a215-f1c6084091f8';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

interface ChatProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
  isWebSpeechEnabled: boolean;
}

const Chat: React.FC<ChatProps> = ({
  input,
  handleInputChange,
  handleMessageSubmit,
  messages,
  isLoading,
  isWebSpeechEnabled,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const handleInputChangeRef = useRef(handleInputChange);

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

  const toggleListening = async () => {
    if (isRecording) {
      stopListening();
      if (input) {
        await handleMessageSubmit(
          new Event('submit') as unknown as FormEvent<HTMLFormElement>
        );
      }
    } else {
      startListening();
    }
    setIsRecording(!isRecording);
  };

  if (!browserSupportsSpeechRecognition) {
    console.log('Browser does not support speech recognition.');
  }

  return (
    <div id="chat" className="flex flex-col w-full lg:w-3/5 px-2 flex-grow">
      <Messages
        messages={messages}
        isLoading={isLoading}
        isWebSpeechEnabled={isWebSpeechEnabled}
      />
      <form
        onSubmit={handleMessageSubmit}
        className="mt-5 mb-2 relative bg-gray-700 rounded-lg"
      >
        <input
          type="text"
          className="input-glow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline pl-3 pr-16 bg-gray-600 border-gray-600 transition-shadow duration-200"
          value={input}
          onChange={handleInputChange}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          Send Message ⮐
          <button
            type="button"
            className={`ml-2 ${
              isWebSpeechEnabled
                ? 'text-gray-400'
                : 'text-gray-500 cursor-not-allowed'
            }`}
            onClick={toggleListening}
            disabled={!isWebSpeechEnabled}
          >
            <FontAwesomeIcon
              icon={isRecording ? faStop : faMicrophone}
              beat={isRecording}
              title={
                isWebSpeechEnabled
                  ? 'Record a Message'
                  : 'Enable Web Speech to Record a Message'
              }
            />
          </button>
        </span>
      </form>
    </div>
  );
};

export default Chat;
