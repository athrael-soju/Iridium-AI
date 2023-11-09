import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import type { CardProps } from '@/types';

interface Props {
  card: CardProps;
  selected: string[] | null;
}

export const Card: FC<Props> = ({ card, selected }) => (
  <div id={card.metadata.hash} className={`card`}>
    <ReactMarkdown>{card.pageContent}</ReactMarkdown>
    <b>{card.metadata.hash}</b>
    <style jsx>{`
      .card {
        width: 100%;
        padding: 1.25rem;
        color: white;
        background-color: ${selected ? '#4A5568' : '#2D3748'};
        border: ${selected ? 'double 4px #63B3ED' : 'none'};
        opacity: ${selected ? '1' : '0.6'};
        transition: opacity 300ms ease-in-out;
      }

      .card:hover {
        opacity: 0.8;
      }

      .hash-text {
        font-size: 0.75rem;
      }
    `}</style>
  </div>
);
