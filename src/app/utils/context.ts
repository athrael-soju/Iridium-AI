import { ScoredVector } from '@pinecone-database/pinecone';
import { getMatchesFromEmbeddings } from './pinecone';
import { getEmbeddings } from './embeddings';

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
};

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (
  message: string,
  namespace: string,
  topK: number,
  maxTokens = 3000,
  minScore = 0.7,
  getOnlyText = true
): Promise<string | ScoredVector[]> => {
  // Get the embeddings of the input message
  const embedding: Response | number[] = await getEmbeddings(message);

  if (embedding instanceof Response) {
    return [];
  }

  // Retrieve the matches for the embeddings from the specified namespace
  const matches = await getMatchesFromEmbeddings(embedding, topK, namespace);

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter((m) => m.score && m.score > minScore);

  if (!getOnlyText) {
    // Use a map to deduplicate matches by URL
    return qualifyingDocs;
  }

  let docs = matches
    ? qualifyingDocs.map((match) => (match.metadata as Metadata).chunk)
    : [];

  return docs.join('\n').substring(0, maxTokens);

  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
};
