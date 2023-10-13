import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';

export interface ICard {
  pageContent: string;
  metadata: {
    hash: string;
  };
}

interface ICardProps {
  card: ICard;
  selected: string[] | null;
}

export const Card: FC<ICardProps> = ({ card, selected }) => (
  <div
    id={card.metadata.hash}
    className={`card w-full p-5 m-2 text-white ${
      selected?.includes(card.metadata.hash) ? 'bg-iridium-chat' : 'bg-iridium'
    } ${
      selected?.includes(card.metadata.hash)
        ? 'border-double border-4 border-sky-500'
        : 'opacity-60 hover:opacity-80 transition-opacity duration-300 ease-in-out'
    }`}
  >
    <ReactMarkdown>{card.pageContent}</ReactMarkdown>
    <b className="text-xs">{card.metadata.hash}</b>
  </div>
);
