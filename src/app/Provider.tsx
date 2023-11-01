'use client';
import { SessionProvider } from 'next-auth/react';
import { useForm, FormProvider } from 'react-hook-form';
import { ConfigProvider } from 'antd';
import {
  DEFAULT_CHUNK_SIZE,
  DEFAULT_OVERLAP,
  DEFAULT_MAX_DEPTH,
  DEFAULT_MAX_PAGES,
} from '@/constants';
import theme from '../../theme/themeConfig';
import type { ContextFormValues } from './components/Context/types';

export default function Provider({ children }: { children: React.ReactNode }) {
  const methods = useForm<ContextFormValues>({
    defaultValues: {
      chunkSize: DEFAULT_CHUNK_SIZE,
      overlap: DEFAULT_OVERLAP,
      maxDepth: DEFAULT_MAX_DEPTH,
      maxPages: DEFAULT_MAX_PAGES,
    },
  });

  return (
    <SessionProvider>
      <ConfigProvider theme={theme}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ConfigProvider>
    </SessionProvider>
  );
}
