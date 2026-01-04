import { NextResponse } from 'next/server';
import { sendMessage } from '@/service/message';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { source, destination, content, sourceType, meta } = body;

    if (!source || !destination || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing fields' },
        { status: 400 }
      );
    }

    const message = await sendMessage({
      source,
      destination,
      content,
      sourceType,
      meta,
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('POST /message/new:', error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
