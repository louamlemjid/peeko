// app/api/users/search/route.ts
import { NextResponse } from 'next/server';
import { getUsersByParams } from '@/service/user';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (q.length < 2) {
    return NextResponse.json({ users: [] });
  }

  const users = await getUsersByParams(q);

  return NextResponse.json({ users: users || [] });
}