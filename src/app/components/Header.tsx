import Image from 'next/image';
import iridiumAILogo from '../../../public/iridium-ai.svg';
export default function Header({ className }: { className?: string }) {
  return (
    <header
      //fixed left-4 top-6 md:right-14 md:top-6
      className={`left-4 top-6 text-gray-200 text-2xl ${className}`}
    >
      {/* https://www.fontspace.com/ */}
      <Image
        src={iridiumAILogo}
        alt="pinecone-logo"
        width="300"
        height="50"
        className="ml-3"
        onClick={() => {
          window.open(
            'https://github.com/athrael-soju/iridium-ai',
            '_blank'
          );
        }}
      />
    </header>
  );
}
