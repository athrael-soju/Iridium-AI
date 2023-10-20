'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { notification } from 'antd';
import { Context } from '@/components/Context';
import Chat from '@/components/Chat';
import { useChat } from 'ai/react';
import { useSession } from 'next-auth/react';
import InstructionModal from './components/InstructionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeMute,
  faVolumeUp,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

const Page: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });
  const namespace = useRef<string>('');
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [isGearSpinning, setGearSpinning] = useState(false);
  const [isSpeechStopped, setIsSpeechStopped] = useState(false);
  const topK = parseInt(process.env.PINECONE_TOPK ?? '10');
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        namespace: namespace.current,
        topK,
      },
      onFinish: async () => {
        setGotMessages(true);
      },
      onError: async (res) => {
        api.error({
          message: 'Error',
          description: res?.message,
          placement: 'bottomRight',
        });
      },
    });
  const prevMessagesLengthRef = useRef(messages.length);
  const handleGearClick = () => {
    setGearSpinning(true);
    setTimeout(() => setGearSpinning(false), 1000); // Turn off spin after 1 second
  };

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
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
          topK,
        }),
      });
      const { context } = await response.json();
      setContext(context.map((c: any) => c.id));
    };
    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages, topK]);

  return (
    <div className="flex flex-col justify-between bg-gray-800 p-2 mx-auto max-w-full ">
      {contextHolder}
      <InstructionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      <Chat
        input={input}
        handleInputChange={handleInputChange}
        handleMessageSubmit={handleMessageSubmit}
        messages={messages}
        isLoading={isLoading}
        isSpeechStopped={isSpeechStopped}
      />
      <Context selected={context} namespace={namespace.current} />
    </div>
  );
};

export default Page;
