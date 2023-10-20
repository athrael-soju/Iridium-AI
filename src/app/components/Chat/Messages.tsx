import { Message } from 'ai';
import { useEffect, useRef } from 'react';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import styled from 'styled-components';

const nlp = winkNLP(model);

const Container = styled.div`
  padding: 6px;
  overflow-y: scroll;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #4a5568;
  height: calc(100vh - 85px);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: -1;
`;

const MessageContainer = styled.div`
  margin: 8px 0;
  padding: 12px;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease-in-out;
  display: flex;
  align-items: center;
  background-color: #2d3748;
  border: 1px solid gray;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &.assistant {
    color: #48bb78;
  }

  &.user {
    color: #4299e1;
  }
`;

const RoleIcon = styled.div`
  padding: 8px;
  border-right: 1px solid gray;
  display: flex;
  align-items: center;
  background-color: #2d3748;
  border-radius: 0.5rem 0 0 0.5rem;
`;

const Content = styled.div`
  margin-left: 8px;
  color: #e2e8f0;
`;

interface MessagesProps {
  readonly messages: Message[];
  readonly isLoading: boolean;
  readonly isWebSpeechEnabled: boolean;
  readonly isSpeechStopped: boolean;
}

let speechSynthesis: SpeechSynthesis;
if (typeof window !== 'undefined') {
  speechSynthesis = window.speechSynthesis;
}

const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};

export default function Messages({
  messages,
  isLoading,
  isWebSpeechEnabled,
  isSpeechStopped,
}: MessagesProps) {
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
          <MessageContainer key={msg.id} className={msg.role}>
            <RoleIcon>{msg.role === 'assistant' ? '🤖' : '🧑‍💻'}</RoleIcon>
            <Content>{msg.content}</Content>
          </MessageContainer>
        );
      })}
      <div ref={messagesEndRef} />
    </Container>
  );
}
