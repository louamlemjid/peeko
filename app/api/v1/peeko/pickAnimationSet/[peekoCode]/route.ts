import { NextResponse } from "next/server";
import { pickAnimationsSet } from "@/service/peeko";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ peekoCode: string }> }
) {
  try {
    const { animationSetId } = await req.json();
    const {peekoCode} = await params;
    
    const peeko = await pickAnimationsSet(peekoCode, animationSetId);

    return NextResponse.json({ success: true, peeko });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
