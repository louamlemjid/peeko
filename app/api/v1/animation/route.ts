import { NextRequest, NextResponse } from "next/server";
import { getAnimations } from "@/service/animation";

export async function GET(req: NextRequest) {
  try {
    console.log("route: main")
    // Fetch animations (optionally filtered by category)
    const animations = await getAnimations();
    console.log(animations)

    return NextResponse.json(
      { success: true, animations },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch animations",
      },
      { status: 500 }
    );
  }
}
