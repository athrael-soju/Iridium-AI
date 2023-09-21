import Image from 'next/image';
import iridiumAILogo from '../../../public/iridium-ai.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
export default function Header({ className }: { className?: string }) {
  return (
    <div className="flex items-center space-x-2">
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
      <button
        className="text-white "
        onClick={() => {
          window.open(
            'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fathrael-soju%2Firidium-ai&env=OPENAI_API_MODEL,OPENAI_API_KEY,OPENAI_API_EMBEDDING_MODEL,PINECONE_API_KEY,PINECONE_ENVIRONMENT,PINECONE_INDEX,PINECONE_TOPK',
            '_blank'
          );
        }}
        title="Deploy with Vercel"
      >
        <FontAwesomeIcon icon={faCloudArrowUp} size="3x" style={{ color: '#97978D' }} />
      </button>
    </div>
  );
}
