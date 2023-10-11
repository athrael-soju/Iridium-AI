'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { Context } from '@/components/Context';
import Header from '@/components/Header';
import Chat from '@/components/Chat';
import { useChat } from 'ai/react';
import { useSession } from 'next-auth/react';
import InstructionModal from './components/InstructionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeMute,
  faVolumeUp,
  faGear,
  faCloudArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import User from '@/components/Login/User';
import { v4 as uuidv4 } from 'uuid';
const Page: React.FC = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });
  const namespace = useRef<string>('');
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isWebSpeechEnabled, setWebSpeechEnabled] = useState(false);
  const [isGearSpinning, setGearSpinning] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isSpeechStopped, setIsSpeechStopped] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      onFinish: async () => {
        setGotMessages(true);
      },
    });
  const prevMessagesLengthRef = useRef(messages.length);
  const handleGearClick = () => {
    setGearSpinning(true);
    setTimeout(() => setGearSpinning(false), 1000); // Turn off spin after 1 second
  };

  const handleVoiceClick = () => {
    setIsFading(true);
    setWebSpeechEnabled(!isWebSpeechEnabled);
    setTimeout(() => setIsFading(false), 820); // Turn off animation after 820 ms
  };

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
    setIsSpeechStopped(false);
  };

  useEffect(() => {
    const iconWrapper = document.getElementById('icon-wrapper');
    if (iconWrapper) {
      iconWrapper.style.display = 'flex';
    }
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      namespace.current = `${session.user.email}_${session.user.name}`;
    } else {
      namespace.current = `${session?.user?.email ?? 'guest'}_${
        session?.user?.name ?? uuidv4()
      }`;
    }
  }, [session]);

  useEffect(() => {
    const getContext = async () => {
      const response = await fetch('/api/context', {
        method: 'POST',
        body: JSON.stringify({
          messages,
          namespace: namespace.current,
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
    <div className="flex flex-col justify-between h-screen bg-gray-800 p-2 mx-auto max-w-full ">
      <Header />
      <div className="fixed items-end right-4 top-12 md:right-4 md:top-8 flex space-x-2">
        <button
          onClick={() => {
            window.open(
              'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fathrael-soju%2Firidium-ai&env=OPENAI_API_MODEL,OPENAI_API_KEY,OPENAI_API_EMBEDDING_MODEL,PINECONE_API_KEY,PINECONE_ENVIRONMENT,PINECONE_INDEX,PINECONE_TOPK',
              '_blank',
              'noopener noreferrer'
            );
          }}
          title="Deploy with Vercel"
        >
          <FontAwesomeIcon
            icon={faCloudArrowUp}
            size="2x"
            style={{ color: 'white' }} // #97978D
          />
        </button>
        <button
          onClick={() => {
            setWebSpeechEnabled(!isWebSpeechEnabled);
            handleVoiceClick();
          }}
          title={
            isWebSpeechEnabled ? 'Disable Web Speech' : 'Enable Web Speech'
          }
        >
          <FontAwesomeIcon
            icon={isWebSpeechEnabled ? faVolumeUp : faVolumeMute}
            size="2x"
            fade={isFading}
            style={{ color: 'white' }}
          />
        </button>
        <button
          onClick={() => {
            const contextWrapper = document.getElementById('contextWrapper');
            if (contextWrapper instanceof HTMLElement) {
              const isHidden =
                contextWrapper.style.transform === 'translateX(110%)';
              contextWrapper.style.transform = isHidden
                ? 'translateX(0%)'
                : 'translateX(110%)';
            }
            handleGearClick();
          }}
          title="Settings"
        >
          <FontAwesomeIcon
            icon={faGear}
            size="2x"
            spin={isGearSpinning}
            style={{ color: 'white' }}
          />
        </button>
        <User session={session} />
        <div />
      </div>
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
          isWebSpeechEnabled={isWebSpeechEnabled}
          isSpeechStopped={isSpeechStopped}
        />

        <div
          className="absolute right-0 w-2/3 transition-transform duration-500 ease-in-out transform translate-x-full lg:w-2/5 lg:mx-2 rounded-lg border border-gray-500"
          id="contextWrapper"
          style={{ transform: 'translateX(110%)', bottom: 0, top: 0 }}
        >
          <div
            className="bg-gray-700 overflow-y-auto h-full rounded-lg border-gray-500 border-2"
            id="contextOverlay"
          >
            <Context
              className=""
              selected={context}
              namespace={namespace.current}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
