import { NextRequest, NextResponse } from "next/server";
import { getAnimations } from "@/service/animation";

interface Params {
  category?: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const { category } = await params;
    console.log("route: ",category)
    // Fetch animations (optionally filtered by category)
    const animations = await getAnimations(category);
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
