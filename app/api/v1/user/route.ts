import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ "this work": "perfectly" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
}
