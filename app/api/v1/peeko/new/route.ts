// src/app/peeko/new/route.ts
import { createPeeko } from "@/service/peeko";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, peekoName } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Missing 'code' in request body" },
        { status: 400 }
      );
    }

    const peeko = await createPeeko(code, peekoName);

    return NextResponse.json({ success: true, peeko });
  } catch (error: any) {
    console.error("Failed to create Peeko:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
