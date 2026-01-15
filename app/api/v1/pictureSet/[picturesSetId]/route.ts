// src/app/PictureSet/[picturesSetId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDB";
import "@/model/animation"; // 👈 force model registration
import { PictureSet } from "@/model/pictureSet";


export async function PUT(req: NextRequest, { params }: { params: Promise<{ picturesSetId: string }> }) {
 
    const { picturesSetId } = await params;

  try {
    const body = await req.json();
    await dbConnect();

    const updatedSet = await PictureSet.findByIdAndUpdate(
      picturesSetId,
      body, // accepts any fields to update
      { new: true }
    ).lean();

    if (!updatedSet) {
      return NextResponse.json({ error: "Animation set not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSet);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ picturesSetId: string }> }) {
  
    const { picturesSetId } = await params;

  try {
    await dbConnect();

    const set = await PictureSet.findById(picturesSetId)
      .populate("animations", "name link category")
      .lean();

    if (!set) return NextResponse.json({ error: "Animation set not found" }, { status: 404 });

    return NextResponse.json(set);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
