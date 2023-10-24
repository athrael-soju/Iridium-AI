import { Message } from 'ai';
import { Typography } from 'antd';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const nlp = winkNLP(model);

const TEXT_COLOR = 'rgb(209, 213, 219)';

const ASSISTANT_BG_COLOR = 'rgb(68, 70, 84)';
const USER_BG_COLOR = 'rgb(52, 53, 65)';

const Container = styled.div`
  margin-top: 64px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 142px);
`;

const MessageDiv = styled.div<{ role: Message['role'] }>`
  padding: 0.75rem;
  transition: box-shadow 200ms ease-in;
  display: flex;
  align-items: center;
  background-color: #2e3a46;

  &:hover {
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
  }

  .ant-typography-copy {
    color: rgb(172, 172, 190) !important;
  }

  ${(props) =>
    props.role === 'assistant' &&
    `
      background-color: ${ASSISTANT_BG_COLOR};
  `}
  ${(props) =>
    props.role === 'user' &&
    `
      background-color: ${USER_BG_COLOR};
  `}
`;

let speechSynthesis: SpeechSynthesis;

if (typeof window !== 'undefined') {
  speechSynthesis = window.speechSynthesis;
}

const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};

interface MessagesProps {
  readonly messages: Message[];
  readonly isLoading: boolean;
}

export default function Messages({ messages, isLoading }: MessagesProps) {
  const { watch } = useFormContext();
  const isWebSpeechEnabled = watch('isWebSpeechEnabled');
  const isSpeechStopped = watch('isSpeechStopped');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sentences = useRef<string[]>([]);
  const speechIndex = useRef<number>(0);

  // Scroll to the most recent message whenever a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Web Speech API Hooks
  useEffect(() => {
    if (isWebSpeechEnabled) {
      sentences.current = [];
    }
  }, [isWebSpeechEnabled]);

  useEffect(() => {
    if (
      isWebSpeechEnabled &&
      !isLoading &&
      sentences.current.length > 0 &&
      speechIndex.current !== 0 &&
      !isSpeechStopped
    ) {
      speak(sentences.current[speechIndex.current]);
      speechIndex.current = 0;
      sentences.current = [];
    }
  }, [isLoading, isSpeechStopped, isWebSpeechEnabled]);

  useEffect(() => {
    if (
      isWebSpeechEnabled &&
      sentences.current.length > 1 &&
      !isSpeechStopped
    ) {
      speak(sentences.current[speechIndex.current]);
      speechIndex.current++;
    }
  }, [isSpeechStopped, isWebSpeechEnabled, sentences.current.length]);

  useEffect(() => {
    if (messages.length > 0 && isLoading) {
      let message = messages[messages.length - 1];
      if (message.role === 'assistant') {
        const doc = nlp.readDoc(message.content);
        sentences.current = doc.sentences().out();
      }
    }
  }, [isLoading, messages]);
  // End Web Speech API Hooks

  return (
    <Container>
      {messages.map((msg) => {
        return (
          <MessageDiv key={msg.id} role={msg?.role}>
            <div
              style={{
                width: '700px',
                margin: '0 auto',
                display: 'flex',
                textAlign: 'left',
              }}
            >
              <div>{msg?.role === 'assistant' ? '🤖' : '🧑‍💻'}</div>
              <Typography.Paragraph
                copyable={msg?.role === 'assistant'}
                style={{
                  color: TEXT_COLOR,
                  marginLeft: '0.5rem',
                  marginBottom: 0,
                  textAlign: 'left',
                }}
              >
                {msg.content}
              </Typography.Paragraph>
            </div>
          </MessageDiv>
        );
      })}
      <div ref={messagesEndRef} />
    </Container>
  );
}
