import { NextResponse } from 'next/server';
import { openMessage } from '@/service/message';

export async function PATCH(
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

    const message = await openMessage(userCode);

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('PATCH /message/open', error);

    return NextResponse.json(
      { success: false, error: 'Failed to open message' },
      { status: 500 }
    );
  }
}
