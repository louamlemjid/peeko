// src/app/animationSet/[animationsSetId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDB";
import { AnimationSet } from "@/model/animationSet";
import "@/model/animation"; // 👈 force model registration


export async function PUT(req: NextRequest, { params }: { params: Promise<{ animationsSetId: string }> }) {
 
    const { animationsSetId } = await params;

  try {
    const body = await req.json();
    await dbConnect();

    const updatedSet = await AnimationSet.findByIdAndUpdate(
      animationsSetId,
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

export async function GET(_req: Request, { params }: { params: Promise<{ animationsSetId: string }> }) {
  
    const { animationsSetId } = await params;

  try {
    await dbConnect();

    const set = await AnimationSet.findById(animationsSetId)
      .populate("animations", "name link category")
      .lean();

    if (!set) return NextResponse.json({ error: "Animation set not found" }, { status: 404 });

    return NextResponse.json(set);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
