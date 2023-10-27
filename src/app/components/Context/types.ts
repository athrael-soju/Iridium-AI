export type SplittingMethodOption = 'markdown' | 'recursive';
export type topKOption = 5 | 10 | 15 | 20;

export interface ContextFormValues {
  showContext: boolean;
  splittingMethod: SplittingMethodOption;
  topKSelection: topKOption;
}
