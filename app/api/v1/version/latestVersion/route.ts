import { getLatestVersion } from "@/service/version";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    console.log("route: main")
    // Fetch animations (optionally filtered by category)
    const version = await getLatestVersion();
    console.log(version)

    return NextResponse.json(
      { success: true, version },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch latest version",
      },
      { status: 500 }
    );
  }
}
