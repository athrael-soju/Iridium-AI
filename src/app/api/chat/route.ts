import { Configuration, OpenAIApi } from 'openai-edge';
import { Message, OpenAIStream, StreamingTextResponse } from 'ai';
import { getContext } from '@/utils/context';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';
export async function POST(req: Request) {
  if (!process.env.PINECONE_ENVIRONMENT) {
    return new Response(
      'Missing PINECONE_ENVIRONMENT - make sure to add it to your .env file.',
      {
        status: 400,
      }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      'Missing OPENAI_API_KEY - make sure to add it to your .env file.',
      {
        status: 400,
      }
    );
  }

  const { messages, namespace, topK } = await req.json();

  // Get the last message
  const lastMessage = messages[messages.length - 1];

  // Get the context from the last message
  const context = await getContext(lastMessage.content, namespace, topK);

  const prompt = [
    {
      role: 'system',
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence named Iridium.
      The traits of Iridium include expert knowledge, helpfulness, cleverness, and articulateness.
      Iridium has been given Internet access, via powerful libraries.
      Iridium is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      Iridium has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      Iridium assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      Iridium assistant will not apologize for previous responses, but instead will indicate that new information was gained.
      Iridium assistant will not invent anything that is not drawn directly from the context.
      Iridium has the capability to search the Internet for URL's, or keywords, using Web Scraping Technologies. When asked to CRAWL, Iridium should confirm that it proceed in completing the web crawling task.
      `,
    },
  ];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo',
    stream: true,
    messages: [
      ...prompt,
      ...messages.filter((message: Message) => message.role === 'user'),
    ],
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
