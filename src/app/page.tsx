'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { notification } from 'antd';
import { useChat } from 'ai/react';
import { useSession } from 'next-auth/react';
import { Context } from '@/components/Context';
import Header from '@/components/Header';
import Chat from '@/components/Chat';
import { ChatScrollAnchor } from '@/components/ChatScrollAnchor';
import PromptInput from '@/components/PromptInput';
import { DARK_BG_COLOR_RGB } from '@/constants';

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

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
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
    <div className="container">
      {contextHolder}
      <Header />
      <Chat
        handleInputChange={handleInputChange}
        messages={messages}
        isLoading={isLoading}
      />
      <ChatScrollAnchor trackVisibility={isLoading} />
      <PromptInput
        input={input}
        handleMessageSubmit={handleMessageSubmit}
        handleInputChange={handleInputChange}
      />
      <Context selected={context} namespace={namespace.current} />
      <style jsx>{`
        .container {
          min-height: 100vh;
          margin: 0 auto;
          max-width: 100%;
          background-color: ${DARK_BG_COLOR_RGB};
        }
      `}</style>
    </div>
  );
};

export default Page;
