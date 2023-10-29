import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = process.env.FILE_UPLOAD_PATH as string;

  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }

  writeFileSync(path + file.name, buffer);

  return NextResponse.json({ success: true });
}
