// src/app/animationSet/route.ts
import { NextResponse } from "next/server";
import { getAnimationSets } from "@/service/animationSet";

export async function GET(req: Request) {
  try {
    const peekoCode = req.url.includes("peekoCode")
      ? new URL(req.url).searchParams.get("peekoCode") || undefined
      : undefined;

    const sets = await getAnimationSets();

    return NextResponse.json(sets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
