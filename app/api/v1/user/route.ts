import dbConnect from "@/lib/mongoDB";
import { User } from "@/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const users = await User.find().lean()

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
}
