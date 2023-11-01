'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { notification } from 'antd';
import { useChat } from 'ai/react';
import { useSession } from 'next-auth/react';
import { Context } from '@/components/Context';
import Header from '@/components/Header';
import Chat from '@/components/Chat';
import { ChatScrollAnchor } from '@/components/ChatScrollAnchor';
import { PromptInput, PromptInputContainer } from '@/components/PromptInput';
import { FileUploader } from '@/components';
import {
  DARK_BG_COLOR_RGB,
  DEFAULT_TOPK,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_OVERLAP,
  DEFAULT_MAX_DEPTH,
  DEFAULT_MAX_PAGES,
} from '@/constants';
import type {
  ContextFormValues,
  topKOption,
  SplittingMethodOption,
  maxDepthOption,
  maxPagesOption,
} from '@/components/Context/types';
import { useCrawl } from '@/hooks';
import { v4 as uuidv4 } from 'uuid';

const Page: React.FC = () => {
  const { watch } = useFormContext<ContextFormValues>();
  const [api, contextHolder] = notification.useNotification();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });
  const namespace = useRef<string>('');
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);

  const chunkSize = watch('chunkSize') ?? DEFAULT_CHUNK_SIZE;
  const overlap = watch('overlap') ?? DEFAULT_OVERLAP;

  const topK: topKOption = watch('topKSelection') ?? DEFAULT_TOPK;
  const maxDepth: maxDepthOption =
    watch('maxDepthSelection') ?? DEFAULT_MAX_DEPTH;
  const maxPages: maxPagesOption =
    watch('maxPagesSelection') ?? DEFAULT_MAX_PAGES;
  const splittingMethod: SplittingMethodOption =
    watch('splittingMethod') ?? 'markdown';

  const crawlDocument = useCrawl();

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

    if (input.toLowerCase().startsWith('crawl')) {
      let crawlInput = input.replace(/^crawl\s*/, '');
      const url = validateAndReturnURL(crawlInput).toString();

      await crawlDocument({
        url,
        splittingMethod,
        chunkSize,
        overlap,
        namespace: namespace.current,
        maxDepth,
        maxPages,
      });
    }
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

  const validateAndReturnURL = (newURL: string) => {
    let url;
    try {
      url = new URL(newURL).toString();
    } catch (e) {
      const baseUrl = 'https://www.google.com/search?q=';
      url = new URL(baseUrl + newURL.replaceAll(' ', '%20'));
    }
    return url;
  };

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
      <PromptInputContainer>
        <FileUploader namespace={namespace ?? ''} />
        <PromptInput
          input={input}
          handleMessageSubmit={handleMessageSubmit}
          handleInputChange={handleInputChange}
        />
      </PromptInputContainer>
      <Context selected={context} namespace={namespace.current} />
      <style jsx>{`
        .container {
          min-height: 100vh;
          margin: 0 auto;
          max-width: 100%;
          background-color: ${DARK_BG_COLOR_RGB};
        }

        .prompt-container {
          position: relative;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default Page;
