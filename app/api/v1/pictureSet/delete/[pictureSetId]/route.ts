// src/app/animationSet/delete/[pictureSetId]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDB";
import { PictureSet } from "@/model/pictureSet";

export async function DELETE(_req: Request, { params }: { params: Promise<{ pictureSetId: string }> }) {
  
    const { pictureSetId } = await params;

  try {
    await dbConnect();

    const deleted = await PictureSet.findByIdAndDelete(pictureSetId).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Animation set not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Animation set deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
