import type { CardProps } from '@/types';

export type SplittingMethodOption = 'markdown' | 'recursive';
export type topKOption = 5 | 10 | 15 | 20;
export type maxDepthOption = 1 | 2 | 3 | 4;
export type maxPagesOption = 1 | 2 | 4 | 8;

export interface ContextFormValues {
  chunkSize: number;
  cards: CardProps[];
  overlap: number;
  showContext: boolean;
  splittingMethod: SplittingMethodOption;
  topKSelection: topKOption;
  maxDepthSelection: maxDepthOption;
  maxPagesSelection: maxPagesOption;
}
