'use client';
import { SessionProvider } from 'next-auth/react';
import { useForm, FormProvider } from 'react-hook-form';
import { ConfigProvider } from 'antd';
import theme from '../../theme/themeConfig';

export default function Provider({ children }: { children: React.ReactNode }) {
  const methods = useForm();
  return (
    <SessionProvider>
      <ConfigProvider theme={theme}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ConfigProvider>
    </SessionProvider>
  );
}
