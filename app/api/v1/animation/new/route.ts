import { NextRequest, NextResponse } from "next/server";
import { createAnimation } from "@/service/animation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, link, category,imageUrl } = body;

    // 1️⃣ Validation
    if (!name || !link || !category) {
      return NextResponse.json(
        { error: "Missing required fields (name, link, category)" },
        { status: 400 }
      );
    }

    // 2️⃣ Create animation
    const animation = await createAnimation(
      name,
      link,
      category,
      imageUrl
    );

    // 3️⃣ Response
    return NextResponse.json(
      { success: true, animation },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error
            : "Failed to create animation",
      },
      { status: 500 }
    );
  }
}
