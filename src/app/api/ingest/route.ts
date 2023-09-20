import { NextResponse } from 'next/server';
import seed from './seed';

export async function POST(req: Request) {
  // TODO: Look into why this only works with parallel uploads = 1 only
  const path = `upload/tmp`;
  const { filename, options } = await req.json();
  try {
    const topK = process.env.PINECONE_TOPK ?? '10';
    const documents = await seed(
      filename,
      path,
      topK,
      process.env.PINECONE_INDEX!,
      options
    );
    return NextResponse.json({ success: true, documents });
  } catch (error) {
    console.error('Error seeding:', error);
    throw error;
  }
}
