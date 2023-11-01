import { IUrlEntry } from './UrlButton';
import { CardProps } from '@/types';

export async function clearIndex(
  setEntries: React.Dispatch<React.SetStateAction<IUrlEntry[]>>,
  setCards: React.Dispatch<React.SetStateAction<CardProps[]>>,
  namespace: string
) {
  const response = await fetch('/api/clearIndex', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      namespaceName: namespace,
    }),
  });

  if (response.ok) {
    setEntries((prevEntries: IUrlEntry[]) =>
      prevEntries.map((entry: IUrlEntry) => ({
        ...entry,
        seeded: false,
        loading: false,
      }))
    );
    setCards([]);
  }
}
