import type { CardProps } from '@/types';

export type SplittingMethodOption = 'markdown' | 'recursive';

export interface ContextFormValues {
  chunkSize: number;
  cards: CardProps[];
  overlap: number;
  showContext: boolean;
  splittingMethod: SplittingMethodOption;
}
