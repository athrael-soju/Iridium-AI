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
