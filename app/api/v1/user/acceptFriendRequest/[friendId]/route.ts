import { acceptFriendRequest } from "@/service/user";
import {useAuth} from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ friendId: string }>
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { friendId } = await  params;

    if (!friendId) {
      return NextResponse.json(
        { error: "Missing friendId in URL" },
        { status: 400 }
      );
    }

    const {userId} = useAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId : clerkId in URL" },
        { status: 400 }
      );
    }



    const user = await acceptFriendRequest(userId,friendId);

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