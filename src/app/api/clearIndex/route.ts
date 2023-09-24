import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST() {
  const pinecone = new Pinecone();
  pinecone.Index(process.env.PINECONE_INDEX!).deleteAll();
  return NextResponse.json({
    success: true,
  });
}
