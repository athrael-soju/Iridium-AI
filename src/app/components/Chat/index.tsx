import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
} from 'react';
import {
  useForm,
  Controller,
  SubmitHandler,
  useFormContext,
} from 'react-hook-form';
import { Form, Input, Button, Tooltip, Space } from 'antd';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import Messages from './Messages';
import { Message } from 'ai/react';

const appId: string = 'df9e9323-8c5d-43c6-a215-f1c6084091f8';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

interface ChatProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
  isSpeechStopped: boolean;
}

const Chat: React.FC<ChatProps> = ({
  input,
  handleInputChange,
  handleMessageSubmit,
  messages,
  isLoading,
  isSpeechStopped,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const { transcript } = useSpeechRecognition();
  const handleInputChangeRef = useRef(handleInputChange);
  const { setValue, watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');
  const { handleSubmit, control } = useForm();

  const startListening = () => SpeechRecognition.startListening();
  const stopListening = () => SpeechRecognition.stopListening();
  const toggleListening = async () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
    setIsRecording(!isRecording);
  };

  useEffect(() => {
    if (transcript) {
      handleInputChangeRef.current({
        target: { value: transcript },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [transcript]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    await handleMessageSubmit(data);
  };

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <Messages
        messages={messages}
        isLoading={isLoading}
        isSpeechStopped={isSpeechStopped}
        isWebSpeechEnabled={isWebSpeechEnabled}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          position: 'fixed',
          bottom: '0',
          width: '100%',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Form.Item name="message" style={{ flex: 1, marginBottom: 0 }}>
            <Input value={input} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Send
              </Button>
              <Tooltip title="Record a Message">
                <Button
                  type="default"
                  disabled={!isWebSpeechEnabled}
                  onClick={toggleListening}
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                </Button>
              </Tooltip>
              <Tooltip title="Stop Message">
                <Button
                  type="default"
                  disabled={!isWebSpeechEnabled}
                  onClick={() => {
                    speechSynthesis.cancel();
                    setIsRecording(false);
                  }}
                >
                  <FontAwesomeIcon icon={faStop} />
                </Button>
              </Tooltip>
            </Space>
          </Form.Item>
        </div>
      </form>
    </div>
  );
};

export default Chat;
