<<<<<<< Updated upstream
'use client';

import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import iridiumAILogo from '../../../../public/iridium-ai.svg';
import RightSide from './RightSide';

export default function Header() {
  const { setValue } = useFormContext();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        zIndex: 1,
      }}
    >
      <Image
        src={iridiumAILogo}
        alt="iridium-logo"
        style={{ cursor: 'pointer', width: 'auto', height: '50px' }}
        onClick={() => {
          window.open(
            'https://github.com/athrael-soju/iridium-ai',
            '_blank',
            'noopener noreferrer'
          );
        }}
      />
      <RightSide />
    </header>
  );
}
=======
import Image from 'next/image';
import iridiumAILogo from '../../../public/iridium-ai.svg';

export default function Header() {
  return (
    <div>
      <header>
        <Image
          src={iridiumAILogo}
          alt="iridium-logo"
          width="300"
          className="my-5 ml-3" // lg:w-80 md:w-60 w-40
          onClick={() => {
            window.open(
              'https://github.com/athrael-soju/iridium-ai',
              '_blank',
              'noopener noreferrer'
            );
          }}
        />
      </header>
    </div>
  );
}
>>>>>>> Stashed changes
