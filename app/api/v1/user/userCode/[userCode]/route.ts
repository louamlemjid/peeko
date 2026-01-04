import { NextResponse } from 'next/server';
import { getUserByCode } from '@/service/user';

type Params = Promise<{
  userCode: string;
}>;

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const { userCode } = await params;

    if (!userCode) {
      return NextResponse.json(
        { success: false, message: 'userCode is required' },
        { status: 400 }
      );
    }

    const user = await getUserByCode(userCode);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('GET /api/v1/user/userCode/[userCode]:', error);

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
