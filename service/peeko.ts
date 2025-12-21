// src/services/peeko.ts

import { IPeeko, Peeko } from "@/model/peeko";
import mongoose from "mongoose";
import { getUserByCode } from "./user";
import { User } from "@/model/user";
import dbConnect from '@/lib/mongoDB'; 

/**
 * Create a Peeko and attach it to a User (1–1)
 */
export async function createPeeko(
  code: string,
  peekoName?: string
): Promise<IPeeko> {
    await dbConnect()
    const session = await mongoose.startSession();
    session.startTransaction();

  try {
    // 1️⃣ Validate user by code
    const user = await getUserByCode(code);

    if (!user) {
      throw new Error("Invalid user code");
    }

    // 2️⃣ Ensure user has no Peeko
    const existingUser = await User.findById(user._id).session(session);

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (existingUser.peeko) {
      throw new Error("User already has a Peeko");
    }

    // 3️⃣ Create Peeko
    const peeko = await Peeko.create(
      [
        {
          code,
          peekoName,
          user: existingUser._id,
        },
      ],
      { session }
    );
    console.log("created peeko: ",peeko)
    // 4️⃣ Attach Peeko to User
    existingUser.peeko = peeko[0]._id;
    await existingUser.save({ session });

    await session.commitTransaction();

    // 5️⃣ Serialize (Next.js safe)
    return JSON.parse(JSON.stringify(peeko[0]));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
