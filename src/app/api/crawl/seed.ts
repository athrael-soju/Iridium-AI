import { getEmbeddings } from '@/utils/embeddings';
import {
  Document,
  MarkdownTextSplitter,
  RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter';
import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { chunkedUpsert } from '../../utils/chunkedUpsert';
import md5 from 'md5';
import { Crawler, Page } from './crawler';
import { truncateStringByBytes } from '@/utils/truncateString';

interface SeedOptions {
  splittingMethod: string;
  chunkSize: number;
  chunkOverlap: number;
  namespace: string;
  maxDepth: number;
  maxPages: number;
}

type DocumentSplitter = RecursiveCharacterTextSplitter | MarkdownTextSplitter;
async function seed(url: string, indexName: string, options: SeedOptions) {
  // Initialize the Pinecone client
  const pinecone = new Pinecone();

  // Destructure the options object
  const {
    splittingMethod,
    chunkSize,
    chunkOverlap,
    namespace,
    maxDepth,
    maxPages,
  } = options;

  // Create a new Crawler with depth 1 and maximum pages as limit
  const crawler = new Crawler(maxDepth, maxPages || 100);

  // Crawl the given URL and get the pages
  const pages = await crawler.crawl(url);

  // Choose the appropriate document splitter based on the splitting method
  const splitter: DocumentSplitter =
    splittingMethod === 'recursive'
      ? new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap })
      : new MarkdownTextSplitter({});

  // Prepare documents by splitting the pages
  const documents = await Promise.all(
    pages.map((page) => prepareDocument(page, splitter))
  );

  // Create Pinecone index if it does not exist
  const indexList = await pinecone.listIndexes();
  const indexExists = indexList.some((index) => index.name === indexName);
  if (!indexExists) {
    await pinecone.createIndex({
      name: indexName,
      dimension: 1536,
      waitUntilReady: true,
    });
  }

  const index = pinecone.Index(indexName);

  // Get the vector embeddings for the documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // Upsert vectors into the Pinecone index
  await chunkedUpsert(index, vectors, namespace, 10);

  // Return the first document
  return documents[0];
}

async function embedDocument(doc: Document): Promise<PineconeRecord> {
  // Generate OpenAI embeddings for the document content
  const embedding = await getEmbeddings(doc.pageContent);

  // Create a hash of the document content
  const hash = md5(doc.pageContent);

  // Return the vector embedding object
  return {
    id: hash, // The ID of the vector is the hash of the document content
    values: embedding, // The vector values are the OpenAI embeddings
    metadata: {
      // The metadata includes details about the document
      chunk: doc.pageContent, // The chunk of text that the vector represents
      text: doc.metadata.text as string, // The text of the document
      url: doc.metadata.url as string, // The URL where the document was found
      hash: doc.metadata.hash as string, // The hash of the document content
    },
  } as PineconeRecord;
}

async function prepareDocument(
  page: Page,
  splitter: DocumentSplitter
): Promise<Document[]> {
  // Get the content of the page
  const pageContent = page.content;

  // Split the documents using the provided splitter
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        url: page.url,
        // Truncate the text to a maximum byte length
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  // Map over the documents and add a hash to their metadata
  return docs.map((doc: Document) => {
    return {
      pageContent: doc.pageContent,
      metadata: {
        ...doc.metadata,
        // Create a hash of the document content
        hash: md5(doc.pageContent),
      },
    };
  });
}

export default seed;
