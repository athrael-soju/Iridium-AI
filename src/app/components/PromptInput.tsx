import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Grid } from 'antd';
import { useFormContext } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition from 'react-speech-recognition';
import { DARK_BG_COLOR_HEX } from '@/constants';

import WebSpeechBtn from './Header/WebSpeechBtn';

const { useBreakpoint } = Grid;

interface Props {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

const PromptInput: React.FC<Props> = ({
  input,
  handleInputChange,
  handleMessageSubmit,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const { setValue, watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');
  const screens = useBreakpoint();
  const isMobile = screens.xs;

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
    <div
      style={{
        backgroundColor: DARK_BG_COLOR_HEX,
        paddingBottom: '20px',
      }}
    >
      <form
        onSubmit={handleMessageSubmit}
        style={{
          width: isMobile ? 'calc(100% - 40px)' : '700px',
        }}
      >
        <input
          value={input}
          onChange={(e) => handleInputChange(e)}
          style={{
            width: isMobile ? 'calc(100% - 40px)' : '700px',
          }}
        />
        <span>
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
        <style jsx>{`
          form {
            background-color: rgb(64, 65, 79);
            border-bottom-color: rgba(32, 33, 35, 0.5);
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            border-bottom-style: solid;
            border-bottom-width: 1px;
            border-image-outset: 0;
            border-image-repeat: stretch;
            border-image-slice: 100%;
            border-image-source: none;
            border-image-width: 1;
            border-left-color: rgba(32, 33, 35, 0.5);
            border-left-style: solid;
            border-left-width: 1px;
            border-right-color: rgba(32, 33, 35, 0.5);
            border-right-style: solid;
            border-right-width: 1px;
            border-top-color: rgba(32, 33, 35, 0.5);
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            border-top-style: solid;
            border-top-width: 1px;
            box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
              rgba(0, 0, 0, 0) 0px 0px 0px 0px,
              rgba(0, 0, 0, 0.1) 0px 0px 15px 0px;
            box-sizing: border-box;
            color: rgb(255, 255, 255);
            color-scheme: dark;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            font-family: 'Söhne', ui-sans-serif, system-ui, -apple-system,
              'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif,
              'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji',
              'Segoe UI Symbol', 'Noto Color Emoji';
            font-feature-settings: normal;
            font-variation-settings: normal;
            height: 58px;
            line-height: 24px;
            position: relative;
            tab-size: 4;
            text-size-adjust: 100%;
            margin: 0 auto;
          }

          input:focus {
            border-color: inherit;
            box-shadow: none;
            outline: none;
          }

          input {
            height: 100px;
            resize: none;
            appearance: none;

            background-color: rgba(0, 0, 0, 0);
            border-bottom-color: rgb(142, 142, 160);
            border-bottom-left-radius: 0px;
            border-bottom-right-radius: 0px;
            border-bottom-style: solid;
            border-bottom-width: 0px;
            border-image-outset: 0;
            border-image-repeat: stretch;
            border-image-slice: 100%;
            border-image-source: none;
            border-image-width: 1;
            border-left-color: rgb(142, 142, 160);
            border-left-style: solid;
            border-left-width: 0px;
            border-right-color: rgb(142, 142, 160);
            border-right-style: solid;
            border-right-width: 0px;
            border-top-color: rgb(142, 142, 160);
            border-top-left-radius: 0px;
            border-top-right-radius: 0px;
            border-top-style: solid;
            border-top-width: 0px;
            box-shadow: none;
            box-sizing: border-box;
            color: rgb(255, 255, 255);
            color-scheme: dark;
            column-count: auto;
            cursor: text;
            display: block;
            font-weight: 400;
            letter-spacing: normal;
            line-height: 24px;
            margin-bottom: 0px;
            margin-left: 0px;
            margin-right: 0px;
            margin-top: 0px;
            max-height: 200px;
            outline-color: rgb(255, 255, 255);
            outline-offset: 0px;
            outline-style: none;
            outline-width: 0px;
            overflow-wrap: break-word;
            padding-bottom: 16px;
            padding-left: 46px;
            padding-right: 48px;
            padding-top: 16px;
            text-align: start;
            text-indent: 0px;
            text-rendering: auto;
            text-shadow: none;
            text-size-adjust: 100%;
            text-transform: none;
            text-wrap: wrap;
            white-space-collapse: preserve;
            word-spacing: 0px;
            writing-mode: horizontal-tb;
          }

          input:focus-visible {
            outline-offset: 0px;
          }

          span {
            position: absolute;
            right: 20px;
            bottom: 15px;
            display: flex;
            align-items: center;
            padding-right: 3px;
            color: gray;
            width: 175px;
          }
        `}</style>
      </form>
    </div>
  );
};

export default PromptInput;
