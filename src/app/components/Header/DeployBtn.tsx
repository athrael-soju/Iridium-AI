import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';

const DeployBtn = () => (
  <button
    onClick={() => {
      window.open(
        'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fathrael-soju%2Firidium-ai&env=OPENAI_API_MODEL,OPENAI_API_KEY,OPENAI_API_EMBEDDING_MODEL,PINECONE_API_KEY,PINECONE_ENVIRONMENT,PINECONE_INDEX,PINECONE_TOPK',
        '_blank',
        'noopener noreferrer'
      );
    }}
    title="Deploy with Vercel"
  >
    <FontAwesomeIcon
      className={styles.uploadSvg}
      icon={faCloudArrowUp}
      size="2x"
      style={{ color: 'white' }} // #97978D
    />
  </button>
);

export default DeployBtn;
