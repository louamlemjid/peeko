// src/services/peeko.ts
import { IPeeko, Peeko } from "@/model/peeko";
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
  await dbConnect();

  try {
    // 1️⃣ Validate user by code
  const user = await getUserByCode(code);
  if (!user) {
    throw new Error("Invalid user code");
  }

  // 2️⃣ Ensure user has no Peeko
  const existingUser = await User.findById(user._id);
  if (!existingUser) {
    throw new Error("User not found");
  }
  if (existingUser.peeko) {
    throw new Error("User already has a Peeko");
  }

  // 3️⃣ Create Peeko
  const peeko = await Peeko.create({
    code,
    peekoName,
    user: existingUser._id,
  });

  console.log("Created Peeko:", peeko);

  // 4️⃣ Attach Peeko to User
  existingUser.peeko = peeko._id;
  await existingUser.save();

  // 5️⃣ Serialize (Next.js safe)
  return JSON.parse(JSON.stringify(peeko));
  } catch (error:unknown) {
    throw new Error("Failed to create Pekko: "+error)
  }
}


export async function getPeekoByCode(peekoCode: string) {
  await dbConnect();

  try {
    const peeko = await Peeko.findOne({ code: peekoCode })
    .populate("user","firstName lastName")
    .lean();

  return JSON.parse(JSON.stringify(peeko));
  } catch (error) {
    return null
  }
}

export async function toggleMood(peekoCode: string, mood: string) {
  await dbConnect();

  try {
    const peeko = await Peeko.findOneAndUpdate(
    { code: peekoCode },
    { mood },
    { new: true }
  ).lean();

  if (!peeko) throw new Error("Peeko not found");
  return peeko;
  } catch (error) {
    throw new Error("Failed to update Mood: "+error)
  }
}

export async function updatePeekoName(peekoCode: string, peekoName: string) {
  await dbConnect();

  try {
    const peeko = await Peeko.findOneAndUpdate(
    { code: peekoCode },
    { peekoName },
    { new: true }
  ).lean();

  if (!peeko) throw new Error("Peeko not found");
  return peeko;
  } catch (error) {
    throw new Error("Failed to update name : "+error)
  }
}
