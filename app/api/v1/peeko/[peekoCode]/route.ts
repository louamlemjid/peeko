import { NextRequest, NextResponse } from "next/server";
import { getPeekoByCode } from "@/service/peeko";

interface Params {
  params: Promise <{
    peekoCode: string;
  }>
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { peekoCode } = await params;

    if (!peekoCode) {
      return NextResponse.json(
        { success: false, error: "Missing peekoCode" },
        { status: 400 }
      );
    }

    const peeko = await getPeekoByCode(peekoCode);

    if (!peeko) {
      return NextResponse.json(
        { success: false, error: "Peeko not found" },
        { status: 404 }
      );
    }
    console.log(peeko)
    return NextResponse.json({
      success: true,
      peeko,
    });
  } catch (error: unknown) {
    console.error("Failed to fetch Peeko:", error);
    return NextResponse.json(
      { success: false, error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
