import React, { useState } from 'react';
import { Form, Button, Drawer, Grid, Divider } from 'antd';
import { useFormContext } from 'react-hook-form';
import { BG_COLOR_HEX, DEFAULT_CHUNK_SIZE } from '@/constants';
import { getURLs } from './urls';
import { Card } from './Card';
import { clearIndex } from './utils';
import SplittingMethod from './SplittingMethod';
import TopKSelection from './TopKSelection';
import type { ContextFormValues, SplittingMethodOption } from './types';

interface ContextProps {
  selected: string[] | null;
  namespace: string;
}

const { useBreakpoint } = Grid;

const DropdownLabel: React.FC<React.PropsWithChildren<{ htmlFor: string }>> = ({
  htmlFor,
  children,
}) => (
  <label htmlFor={htmlFor} className="text-white p-2 font-bold">
    {children}
  </label>
);

export const Context: React.FC<ContextProps> = ({ selected, namespace }) => {
  const { setValue, watch } = useFormContext<ContextFormValues>();
  const [entries, setEntries] = useState(getURLs);
  const showContext = watch('showContext');
  const chunkSize = watch('chunkSize') ?? DEFAULT_CHUNK_SIZE;
  const overlap = watch('overlap') ?? 1;
  const splittingMethod: SplittingMethodOption =
    watch('splittingMethod') ?? 'markdown';
  const cards = watch('cards');
  const setCards = (v: any) => setValue('cards', v);
  const screens = useBreakpoint();
  const isMobile = screens.xs;
  return (
    <Drawer
      open={showContext}
      onClose={() => setValue('showContext', false)}
      style={{ backgroundColor: BG_COLOR_HEX, position: 'relative' }}
      width={isMobile ? '100%' : '500px'}
    >
      <div className={`flex flex-col overflow-y-auto rounded-lg  w-full`}>
        <div className="flex flex-col items-start sticky top-0 w-full">
          <div className="flex-grow w-full px-4">
            <Divider />
            <Form
              initialValues={{
                splittingMethod: 'markdown',
                topKSelection: 5,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <Button
                  block
                  onClick={() => clearIndex(setEntries, setCards, namespace)}
                >
                  Clear Index
                </Button>
              </div>
              <Divider />
              <TopKSelection />
              <SplittingMethod />
              <div className="text-left w-full flex flex-col p-2 subpixel-antialiased">
                {splittingMethod === 'recursive' && (
                  <div
                    className="my-4 flex flex-col"
                    style={{
                      color: 'white',
                    }}
                  >
                    <div className="flex flex-col w-full">
                      <DropdownLabel htmlFor="chunkSize">
                        Chunk Size: {chunkSize}
                      </DropdownLabel>
                      <input
                        className="p-2 bg-gray-700"
                        type="range"
                        id="chunkSize"
                        min={1}
                        max={2048}
                        onChange={(e) =>
                          setValue('chunkSize', parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <DropdownLabel htmlFor="overlap">
                        Overlap: {overlap}
                      </DropdownLabel>
                      <input
                        className="p-2 bg-gray-700"
                        type="range"
                        id="overlap"
                        min={1}
                        max={200}
                        onChange={(e) =>
                          setValue('overlap', parseInt(e.target.value))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </Form>
          </div>
          <Divider />
        </div>
        <div>
          {cards?.map((card) => (
            <Card key={card.metadata.hash} card={card} selected={selected} />
          ))}
        </div>
      </div>
    </Drawer>
  );
};
