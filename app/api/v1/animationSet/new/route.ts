// src/app/animationSet/new/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAnimationSet } from "@/service/animationSet";

export async function POST(req: NextRequest) {
  try {
    const { name, category, animations, paid,price } = await req.json();

    if (!name || !category || !animations?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const animationSet = await createAnimationSet(
      name,
      category,
      animations,
      paid,
      price
    );

    return NextResponse.json(animationSet, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create animation set" },
      { status: 500 }
    );
  }
}
