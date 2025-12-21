import { NextResponse } from "next/server";
import { toggleMood } from "@/service/peeko";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ peekoCode: string }> }
) {
  try {
    const { mood } = await req.json();
    const {peekoCode} = await params;
    
    const peeko = await toggleMood(peekoCode, mood);

    return NextResponse.json({ success: true, peeko });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
