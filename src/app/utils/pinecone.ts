import {
  Index,
  Pinecone,
  PineconeRecord,
  type ScoredPineconeRecord,
} from '@pinecone-database/pinecone';

const indexExists = async (client: Pinecone, indexName: string) => {
  // Retrieve the list of indexes
  const indexes = await client.listIndexes();

  // Check if the desired index is present
  return indexes.some((index) => {
    return index.name === indexName;
  });
};

const createIndexIfNotExists = async (
  client: Pinecone,
  indexName: string,
  dimension: number
) => {
  try {
    if (!indexExists(client, indexName)) {
      console.log('Creating index and Waiting until is ready...', indexName);
      await client.createIndex({
        name: indexName,
        dimension,
        waitUntilReady: true,
      });
      console.log('Index is ready.');
    }
  } catch (e) {
    console.error('Error creating index', e);
  }
};

const sliceIntoChunks = <T>(arr: T[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );
};

const chunkedUpsert = async (
  index: Index,
  vectors: Array<PineconeRecord>,
  namespace: string,
  chunkSize = 10
) => {
  // Split the vectors into chunks
  const chunks = sliceIntoChunks<PineconeRecord>(vectors, chunkSize);

  try {
    // Upsert each chunk of vectors into the index
    await Promise.allSettled(
      chunks.map(async (chunk) => {
        try {
          await index.namespace(namespace).upsert(vectors);
        } catch (e) {
          console.log('Error upserting chunk', e);
        }
      })
    );

    return true;
  } catch (e) {
    throw new Error(`Error upserting vectors into index: ${e}`);
  }
};

// The function `getMatchesFromEmbeddings` is used to retrieve matches for the given embeddings
const getMatchesFromEmbeddings = async (
  embeddings: number[],
  topK: number,
  namespace: string
): Promise<ScoredPineconeRecord[]> => {
  // Obtain a client for Pinecone
  const pinecone = new Pinecone();

  // Check if the desired index is present, else throw an error
  if (!indexExists(pinecone, process.env.PINECONE_INDEX!)) {
    throw new Error(`Index ${process.env.PINECONE_INDEX} does not exist`);
  }

  // Get the Pinecone index
  const index = pinecone.Index(process.env.PINECONE_INDEX!);

  // Get the namespace
  const pineconeNamespace = index.namespace(namespace ?? '');

  try {
    // Query the index with the defined request
    const queryResult = await pineconeNamespace.query({
      vector: embeddings,
      topK,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (e) {
    // Log the error and throw it
    console.log('Error querying embeddings: ', e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
};

export { createIndexIfNotExists, chunkedUpsert, getMatchesFromEmbeddings };
