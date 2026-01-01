import { NextRequest, NextResponse } from "next/server";
import { deleteAnimation } from "@/service/animation";

interface RouteParams {
  params: Promise<{
    animationId: string;
  }>
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { animationId } = await params;

    // 1️⃣ Validation
    if (!animationId) {
      return NextResponse.json(
        { success: false, error: "Animation ID is required" },
        { status: 400 }
      );
    }

    // 2️⃣ Delete animation
    await deleteAnimation(animationId);

    // 3️⃣ Response
    return NextResponse.json(
      { success: true, message: "Animation deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete animation",
      },
      { status: 500 }
    );
  }
}
