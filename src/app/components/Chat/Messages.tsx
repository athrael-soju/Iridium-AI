import { Message } from 'ai';
import { useEffect, useRef } from 'react';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
const nlp = winkNLP(model);

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
}: {
  messages: Message[];
  isLoading: boolean;
  isWebSpeechEnabled: boolean;
  isSpeechStopped: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sentences = useRef<string[]>([]);
  const speechIndex = useRef<number>(0);

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
    <div className="border-2 border-gray-600 p-6 rounded-lg overflow-y-scroll flex-grow flex flex-col bg-gray-700">
      {messages.map((msg) => {
        return (
          <div
            key={msg.id}
            className={`${
              msg.role === 'assistant' ? 'text-green-300' : 'text-blue-300'
            } my-2 p-3 rounded shadow-md hover:shadow-lg transition-shadow duration-200 flex slide-in-bottom bg-gray-800 border border-gray-600 message-glow`}
          >
            <div className="rounded-tl-lg bg-gray-800 p-2 border-r border-gray-600 flex items-center">
              {msg.role === 'assistant' ? '🤖' : '🧑‍💻'}
            </div>
            <div className="ml-2 flex items-center text-gray-200">
              {msg.content}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
