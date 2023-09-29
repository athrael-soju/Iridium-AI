import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = 'src/app/api/upload/tmp/';

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    writeFileSync(path + file.name, buffer);
    console.log(`Successfullly uploaded ${file.name}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading:', error);
    throw error;
  }
}
