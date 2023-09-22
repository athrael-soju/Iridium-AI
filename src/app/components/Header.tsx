import Image from 'next/image';
import iridiumAILogo from '../../../public/iridium-ai.svg';
export default function Header({ className }: { className?: string }) {
  return (
    <div className="flex space-x-2">
      <header className={`left-4 top-6 text-gray-200 text-2xl ${className}`}>
        <Image
          src={iridiumAILogo}
          alt="iridium-logo"
          width="300"
          className="ml-3"
          onClick={() => {
            window.open('https://github.com/athrael-soju/iridium-ai', '_blank');
          }}
        />
      </header>
    </div>
  );
}
