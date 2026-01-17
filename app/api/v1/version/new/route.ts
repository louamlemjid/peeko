import { createVersion } from "@/service/version";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, link, number,description } = body;

    // 1️⃣ Validation
    if (!name || !link || !number) {
      return NextResponse.json(
        { error: "Missing required fields (name, link, number)" },
        { status: 400 }
      );
    }

    // 2️⃣ Create version
    const version = await createVersion(
      name,
      link,
      description,
      number
    );

    // 3️⃣ Response
    return NextResponse.json(
      { success: true, version },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error
            : "Failed to create version",
      },
      { status: 500 }
    );
  }
}
