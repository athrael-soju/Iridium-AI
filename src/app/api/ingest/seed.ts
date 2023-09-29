import { readdirSync, unlinkSync } from 'fs';
import { getEmbeddings } from '@/utils/embeddings';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { getPineconeClient } from '@/utils/pinecone';
import { utils as PineconeUtils, Vector } from '@pinecone-database/pinecone';
import { truncateStringByBytes } from '@/utils/truncateString';
import md5 from 'md5';

import {
  Document,
  MarkdownTextSplitter,
  RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter';

interface SeedOptions {
  splittingMethod: string;
  chunkSize: number;
  chunkOverlap: number;
}
type DocumentSplitter = RecursiveCharacterTextSplitter | MarkdownTextSplitter;

const { chunkedUpsert, createIndexIfNotExists } = PineconeUtils;

async function seed(
  filename: string,
  path: string,
  topK: string,
  index: string,
  options: SeedOptions
) {
  try {
    //TODO: Add topK support

    // Initialize the Pinecone client
    const pinecone = await getPineconeClient();

    // Destructure the options object
    const { splittingMethod, chunkSize, chunkOverlap } = options;

    const directoryLoader = new DirectoryLoader(path, {
      '.pdf': (path) => new PDFLoader(path),
      '.docx': (path) => new DocxLoader(path),
      '.txt': (path) => new TextLoader(path),
    });

    const docs = await directoryLoader.load();
    // Choose the appropriate document splitter based on the splitting method
    const splitter: DocumentSplitter =
      splittingMethod === 'recursive'
        ? new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap })
        : new MarkdownTextSplitter({});

    // Prepare documents by splitting the pages
    const documents = await Promise.all(
      docs.map((doc) => prepareDocument(doc, filename, splitter))
    );

    await createIndexIfNotExists(pinecone, index, 1536);

    // Get the vector embeddings for the documents
    // Warning: For larger files, the chunk size should be increased accordingly.
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // Upsert vectors into the Pinecone index
    await chunkedUpsert(pinecone?.Index(index)!, vectors, '', 10);
    const filesToDelete = readdirSync(path);
    // TODO: Decided if this is needed.
    // .filter(
    //   (file) =>
    //     file.endsWith('.pdf') || file.endsWith('.docx') || file.endsWith('.txt')
    // );
    filesToDelete.forEach((file) => {
      console.log('Deleting file: ', file);
      unlinkSync(`${path}/${file}`);
    });
    return documents[0];
  } catch (error) {
    console.error('Error seeding:', error);
    throw error;
  }
}

async function embedDocument(doc: Document): Promise<Vector> {
  try {
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
        filename: doc.metadata.filename as string, // The URL where the document was found
        hash: doc.metadata.hash as string, // The hash of the document content
      },
    } as Vector;
  } catch (error) {
    console.log('Error embedding document: ', error);
    throw error;
  }
}

async function prepareDocument(
  doc: Document,
  filename: string,
  splitter: DocumentSplitter
): Promise<Document[]> {
  // Get the content of the page
  const pageContent = doc.pageContent;

  // Split the documents using the provided splitter
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        filename: filename,
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
