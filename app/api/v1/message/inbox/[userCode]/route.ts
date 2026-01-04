import { NextResponse } from 'next/server';
import { getInbox } from '@/service/message';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userCode: string }> }
) {
  try {
    const { userCode } = await params;

    if (!userCode) {
      return NextResponse.json(
        { success: false, error: 'userCode is required' },
        { status: 400 }
      );
    }

    const messages = await getInbox(userCode);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('GET /api/v1/message/inbox/[userCode]', error);

    return NextResponse.json(
      { success: false, error: 'Failed to fetch inbox' },
      { status: 500 }
    );
  }
}
