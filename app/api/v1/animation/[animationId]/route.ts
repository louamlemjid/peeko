import { NextRequest, NextResponse } from "next/server";
import { updateAnimation } from "@/service/animation";

type Params = {
  animationId: string;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { animationId } = await params;
    const body = await req.json();
    const { name, link, category, imageUrl } = body;

    // 1️⃣ Validation
    if (!animationId) {
      return NextResponse.json(
        { success: false, error: "Missing animationId" },
        { status: 400 }
      );
    }

    if (!name && !link && !category && !imageUrl) {
      return NextResponse.json(
        { success: false, error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // 2️⃣ Update animation
    const updatedAnimation = await updateAnimation(animationId, {
      name,
      link,
      category,
      imageUrl,
    });

    if (!updatedAnimation) {
      return NextResponse.json(
        { success: false, error: "Animation not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Response
    return NextResponse.json(
      { success: true, animation: updatedAnimation },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update animation",
      },
      { status: 500 }
    );
  }
}
