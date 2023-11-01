import type { CardProps } from '@/types';

export type SplittingMethodOption = 'markdown' | 'recursive';
export type topKOption = 5 | 10 | 15 | 20;

export interface ContextFormValues {
  chunkSize: number;
  cards: CardProps[];
  loading: boolean;
  overlap: number;
  showContext: boolean;
  splittingMethod: SplittingMethodOption;
  topKSelection: topKOption;
}
