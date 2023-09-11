'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { Context } from '@/components/Context';
import Header from '@/components/Header';
import Chat from '@/components/Chat';
import { useChat } from 'ai/react';
import InstructionModal from './components/InstructionModal';

const Page: React.FC = () => {
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      onFinish: async () => {
        setGotMessages(true);
      },
    });

  const prevMessagesLengthRef = useRef(messages.length);

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  useEffect(() => {
    const getContext = async () => {
      const response = await fetch('/api/context', {
        method: 'POST',
        body: JSON.stringify({
          messages,
        }),
      });
      const { context } = await response.json();
      setContext(context.map((c: any) => c.id));
    };
    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages]);

  return (
    <div className="flex flex-col justify-between h-screen bg-gray-800 p-2 mx-auto max-w-full">
      <Header className="my-5" />
      <button
        className="fixed right-6 top-12 md:right-6 md:top-12 text-xl text-white"
        onClick={() => {
          const contextWrapper = document.getElementById('contextWrapper');
          if (contextWrapper instanceof HTMLElement) {
            const isHidden =
              contextWrapper.style.transform === 'translateX(110%)';
            contextWrapper.style.transform = isHidden
              ? 'translateX(0%)'
              : 'translateX(110%)';
          }
        }}
      >
        ☰
      </button>

      <InstructionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />

      <div className="flex w-full flex-grow overflow-hidden relative">
        <Chat
          input={input}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleMessageSubmit}
          messages={messages}
          isLoading={isLoading}
        />
        <div
          className="absolute right-0 w-2/3 transition-transform duration-500 ease-in-out transform translate-x-full overflow-hidden lg:w-2/5 lg:mx-2 rounded-lg"
          id="contextWrapper"
          style={{ transform: 'translateX(110%)' }}
        >
          <div
            className="h-full bg-gray-700 overflow-y-auto max-h-[77.5vh]"
            id="contextOverlay"
          >
            <Context className="" selected={context} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
