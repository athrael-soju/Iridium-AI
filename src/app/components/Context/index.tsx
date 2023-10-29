import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { Form, Button, Drawer, Input, Grid, Divider } from 'antd';
import { useFormContext } from 'react-hook-form';
import { BG_COLOR_HEX, DEFAULT_CHUNK_SIZE } from '@/constants';
import { getURLs, addURL, clearURLs } from './urls';
import UrlButton, { IUrlEntry } from './UrlButton';
import { Card } from './Card';
import { clearIndex, crawlDocument } from './utils';
import SplittingMethod from './SplittingMethod';
import TopKSelection from './TopKSelection';
import type { ContextFormValues, SplittingMethodOption } from './types';

interface ContextProps {
  selected: string[] | null;
  namespace: string;
}

const { useBreakpoint } = Grid;

const BtnsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  margin: 1rem;
`;

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

  const [newURL, setNewURL] = useState('');
  const screens = useBreakpoint();
  const isMobile = screens.xs;

  const handleNewURLSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newURL.length > 0) {
      const url = validateAndReturnURL();
      addURL({
        url: url.toString(),
        title: newURL,
        seeded: false,
        loading: false,
      });
      let newURLList = [...getURLs()];
      setEntries(newURLList);
      setNewURL('');
    }
  };

  const handleClearURLsSubmit = async () => {
    const newURLList: IUrlEntry[] = [];
    clearURLs();
    setEntries(newURLList);
  };

  const validateAndReturnURL = () => {
    let url;
    try {
      url = new URL(newURL);
    } catch (e) {
      const baseUrl = 'https://www.google.com/search?q=';
      url = new URL(baseUrl + newURL.replaceAll(' ', '%20'));
    }
    return url;
  };

  const buttons = (
    <BtnsContainer>
      {entries.map((entry: IUrlEntry) => (
        <div key={entry.url}>
          <UrlButton
            entry={entry}
            onClick={() =>
              crawlDocument(
                entry.url,
                setEntries,
                setCards,
                splittingMethod,
                chunkSize,
                overlap,
                namespace
              )
            }
          />
        </div>
      ))}
    </BtnsContainer>
  );

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
                <Button block onClick={handleClearURLsSubmit}>
                  Clear URL List
                </Button>
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
          <form
            onSubmit={handleNewURLSubmit}
            className="mt-5 mb-5 relative bg-gray-700 rounded-lg"
          >
            <Input
              size="large"
              type="text"
              value={newURL}
              onChange={(e) => setNewURL(e.target.value)}
            />
            <span>Add URL ⮐</span>
            <style jsx>{`
              form {
                position: relative;
                margin-bottom: 1rem;
              }

              span {
                position: absolute;
                top: 8px;
                right: 10px;
                color: #fff;
              }
            `}</style>
          </form>
        </div>
        {buttons}
        <Divider />
        <div>
          {cards?.map((card) => (
            <Card key={card.metadata.hash} card={card} selected={selected} />
          ))}
        </div>
      </div>
    </Drawer>
  );
};
