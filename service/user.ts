import crypto from "crypto";
import { IUser, User } from "@/model/user";
import "@/model/peeko"; 

import dbConnect from '@/lib/mongoDB'; 

/* ===== Generate unique user code ===== */
async function generateUniqueUserCode(): Promise<string> {
  while (true) {
    const code = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase(); // e.g. A9F3C2

    const exists = await User.exists({ userCode: code });
    if (!exists) return code;
  }
}

/* ===== Create user service ===== */
export interface CreateUserInput {
  clerkId: string;
  email?: string;
  username?: string;
  firstName:string|null;
  lastName:string|null;
}

export async function createUser({
  clerkId,
  email,
  username,
  firstName,
  lastName
}: CreateUserInput):Promise<IUser|null> {
  await dbConnect()
  try {
    /* Prevent duplicates (webhook retries safe) */
  const existingUser = await User.findOne({ clerkId });
  if (existingUser) return existingUser;

  const userCode = await generateUniqueUserCode();

  const user = await User.create({
    clerkId,
    email,
    username,
    userCode,
    firstName,
    lastName,
    phoneVerified: false,
    isOnline: false,
  });

  return user;
  } catch (error) {
    console.error("service/user : ",error);
    return null
  }
}

export async function getUserByCode(code: string): Promise<IUser | null> {
  await dbConnect();
  try {
    const user = await User.findOne({ userCode: code }).lean();
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error("service/user: ",error);
    return null
  }
}

export async function getUserByClerkId(clerkId: string) :Promise<IUser|null> {
  await dbConnect();

  try {
    const user = await User.findOne({ clerkId })
    .populate("peeko")
    .lean(); // lean() returns plain JSON
console.log(user)
  return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error("service/user: ",error);
    return null
  }
}

export async function addAnimationSet(clerkId: string,animationSetId:string) :Promise<IUser|null> {
  await dbConnect();

  try {
    const user = await User.findOneAndUpdate({clerkId}, {
      $addToSet: { animationSets: animationSetId } 
    }, { new: true });
    console.log(user)
  return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error("service/user: ",error);
    return null
  }
}
export async function dropUniue() {
  try {
    await dbConnect();
    const dropped = await User.collection.dropIndex("username_1");
    console.log("dropped: ",dropped)
  } catch (error) {
    console.log("error: ",error)
  }
}

export async function getAnimationSet(clerkId: string) :Promise<IUser["animationSets"]|null> {
  await dbConnect();

  try {
    const userAnimationSets = await User.findOne({clerkId})
    .populate("animationSets")
    .lean()
    console.log(userAnimationSets)
  return userAnimationSets ? JSON.parse(JSON.stringify(userAnimationSets)) : null;
  } catch (error) {
    console.error("service/user: ",error);
    return null
  }
}