import { getVersions } from "@/service/version";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    // Fetch animations (optionally filtered by category)
    const versions = await getVersions();
    console.log(versions)

    return NextResponse.json(
      { success: true, versions },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch versions",
      },
      { status: 500 }
    );
  }
}
