import { OpenAIApi, Configuration } from 'openai-edge';

export async function getEmbeddings(input: string) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      'Missing OPENAI_API_KEY - make sure to add it to your .env file.',
      {
        status: 400,
      }
    );
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  try {
    const model =
      process.env.OPENAI_API_EMBEDDING_MODEL ?? 'text-embedding-ada-002';

    const response = await openai.createEmbedding({
      model,
      input: input.replace(/\n/g, ' '),
    });

    const result = await response.json();
    return result.data[0].embedding as number[];
  } catch (e) {
    throw new Error(`Error calling OpenAI embedding API: ${e}`);
  }
}
