// src/app/user/[clerkId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addAnimationSet, getAnimationSet } from "@/service/user";

interface Params {
  params: Promise<{ clerkId: string }>
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { clerkId } = await  params;

    if (!clerkId) {
      return NextResponse.json(
        { error: "Missing clerkId in URL" },
        { status: 400 }
      );
    }
    
console.log("route: ",clerkId)

    const userAnimationSets = await getAnimationSet(clerkId);

    if (!userAnimationSets) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userAnimationSets);
  } catch (error: any) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { clerkId } = await  params;

    if (!clerkId) {
      return NextResponse.json(
        { error: "Missing clerkId in URL" },
        { status: 400 }
      );
    }
    
    const {animationSetId} = await req.json()
console.log("route: ",clerkId)
console.log("route: ",animationSetId)

    const user = await addAnimationSet(clerkId,animationSetId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


