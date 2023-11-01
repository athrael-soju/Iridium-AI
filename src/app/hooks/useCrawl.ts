import axios, { AxiosRequestConfig } from 'axios';
import { useFormContext } from 'react-hook-form';
import type { ContextFormValues } from '@/components/Context/types';

interface Props {
  url: string;
  splittingMethod: string;
  chunkSize: number;
  overlap: number;
  maxDepth: number;
  maxPages: number;
  namespace: string;
}

export const useCrawl = () => {
  const { setValue } = useFormContext<ContextFormValues>();

  const crawl = async ({
    url,
    splittingMethod,
    chunkSize,
    overlap,
    namespace,
  }: Props) => {
    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'application/json' },
      data: {
        url,
        options: {
          splittingMethod,
          chunkSize,
          overlap,
          namespace,
        },
      },
    };

    try {
      setValue('loading', true);
      const response = await axios.post('/api/crawl', config);
      const { documents } = await response.data;
      setValue('loading', false);
      setValue('cards', documents);
    } catch (error) {
      setValue('loading', false);
      console.error('An error occurred:', error);
    }
  };

  return crawl;
};
