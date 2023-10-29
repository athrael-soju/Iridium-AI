import { NextResponse } from 'next/server';
import seed from './seed';

export async function POST(req: Request) {
  // Look into why this only works with parallel uploads = 1 only
  const path = process.env.FILE_UPLOAD_PATH as string;
  try {
    const { filename, options } = await req.json();
    const topK = options.topK;
    const documents = await seed(
      filename,
      path,
      topK,
      process.env.PINECONE_INDEX!,
      options
    );
    return NextResponse.json({ success: true, documents });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
