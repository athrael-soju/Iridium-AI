import React, { FormEvent, useState } from 'react';
import { Button, Drawer, Input, Grid } from 'antd';
import { useFormContext } from 'react-hook-form';
import { getURLs, addURL, clearURLs } from './urls';
import UrlButton, { IUrlEntry } from './UrlButton';
import { Card, ICard } from './Card';
import { clearIndex, crawlDocument } from './utils';
import FileUpload from '../FileUpload';
import SplittingMethod from './SplittingMethod';

interface ContextProps {
  selected: string[] | null;
  namespace: string;
}

const { useBreakpoint } = Grid;

export const Context: React.FC<ContextProps> = ({ selected, namespace }) => {
  const { setValue, watch } = useFormContext();
  const [entries, setEntries] = useState(getURLs);
  const [cards, setCards] = useState<ICard[]>([]);
  const showContext = watch('showContext');
  const splittingMethod = watch('splittingMethod');
  const [newURL, setNewURL] = useState('');
  const [chunkSize, setChunkSize] = useState(256);
  const [overlap, setOverlap] = useState(1);
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

  // Think what to do with this
  // useEffect(() => {
  //   const element = selected && document.getElementById(selected[0]);
  //   element?.scrollIntoView({ behavior: 'smooth' });
  // }, [selected]);

  const DropdownLabel: React.FC<
    React.PropsWithChildren<{ htmlFor: string }>
  > = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="text-white p-2 font-bold">
      {children}
    </label>
  );

  const buttons = entries.map((entry: IUrlEntry, key: number) => (
    <div className="" key={`${key}-${entry.loading}`}>
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
  ));

  return (
    <Drawer
      open={showContext}
      onClose={() => setValue('showContext', false)}
      style={{ backgroundColor: '#4f6574' }}
      width={isMobile ? '100%' : '500px'}
    >
      <div className={`flex flex-col overflow-y-auto rounded-lg  w-full`}>
        <div className="flex flex-col items-start sticky top-0 w-full">
          <div className="flex-grow w-full px-4">
            <div className="my-2">
              <FileUpload
                chunkSize={chunkSize}
                overlap={overlap}
                setCards={setCards}
                namespace={namespace}
              />
            </div>
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
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                Add URL ⮐
              </span>
            </form>
            <div className="flex justify-between">
              <Button
                className="my-2 uppercase active:scale-[98%] transition-transform duration-100"
                style={{
                  backgroundColor: '#4f6574',
                  color: 'white',
                  width: '48%',
                }}
                onClick={handleClearURLsSubmit}
              >
                Clear URL List
              </Button>
              <Button
                className="my-2 uppercase active:scale-[98%] transition-transform duration-100"
                style={{
                  backgroundColor: '#4f6574',
                  color: 'white',
                  width: '48%',
                }}
                onClick={() => clearIndex(setEntries, setCards, namespace)}
              >
                Clear Index
              </Button>
            </div>
            <SplittingMethod />
          </div>
          <div className="text-left w-full flex flex-col p-2 subpixel-antialiased">
            {splittingMethod === 'recursive' && (
              <div className="my-4 flex flex-col">
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
                    onChange={(e) => setChunkSize(parseInt(e.target.value))}
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
                    onChange={(e) => setOverlap(parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col lg:flex-row w-full lg:flex-wrap p-2">
            {buttons}
          </div>
        </div>
        <div className="flex flex-wrap w-full">
          {cards?.map((card) => (
            <Card key={card.metadata.hash} card={card} selected={selected} />
          ))}
        </div>
      </div>
    </Drawer>
  );
};
