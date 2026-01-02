// src/app/animationSet/delete/[animationSetId]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDB";
import { AnimationSet } from "@/model/animationSet";

export async function DELETE(_req: Request, { params }: { params: Promise<{ animationSetId: string }> }) {
  
    const { animationSetId } = await params;

  try {
    await dbConnect();

    const deleted = await AnimationSet.findByIdAndDelete(animationSetId).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Animation set not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Animation set deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
