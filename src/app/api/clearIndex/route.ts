import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(req: NextRequest) {
  const { namespaceName } = await req.json();

  // Instantiate a new Pinecone client
  const pinecone = new Pinecone();
  // Select the desired index
  const index = pinecone.Index(process.env.PINECONE_INDEX!);

  // Use the namespace for user-specific Index clearing  
  const namespace = index.namespace(namespaceName);

  // Delete everything within the namespace
  await namespace.deleteAll();

  return NextResponse.json({
    success: true,
  });
}
