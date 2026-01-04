import { NextResponse } from 'next/server';
import { getConversation } from '@/service/message';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userA, userB } = body;

    if (!userA || !userB) {
      return NextResponse.json(
        { success: false, message: 'userA and userB are required' },
        { status: 400 }
      );
    }

    const messages = await getConversation(userA, userB);
console.log(userA,userB,messages)
    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('POST /api/v1/message/conversation:', error);

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
