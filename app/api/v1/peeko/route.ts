import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const code = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    return NextResponse.json({ code });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate code" },
      { status: 500 }
    );
  }
}
