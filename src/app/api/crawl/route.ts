import seed from './seed';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { data } = await req.json();
  const url = data?.url;
  const options = data?.options;

  try {
    const documents = await seed(url, process.env.PINECONE_INDEX!, options);
    return NextResponse.json({ success: true, documents });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed crawling' });
  }
}
