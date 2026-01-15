// src/app/animationSet/route.ts
import { getPictureSets } from "@/service/pictureSet";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const peekoCode = req.url.includes("peekoCode")
      ? new URL(req.url).searchParams.get("peekoCode") || undefined
      : undefined;

    const sets = await getPictureSets();

    return NextResponse.json(sets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
