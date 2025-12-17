import crypto from "crypto";
import { User } from "@/model/user";

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
  username: string;
  phoneNumber: string;
}

export async function createUserService({
  clerkId,
  email,
  username,
  phoneNumber,
}: CreateUserInput) {
  /* Prevent duplicates (webhook retries safe) */
  const existingUser = await User.findOne({ clerkId });
  if (existingUser) return existingUser;

  const userCode = await generateUniqueUserCode();

  const user = await User.create({
    clerkId,
    email,
    username,
    phoneNumber,
    userCode,
    phoneVerified: false,
    isOnline: false,
  });

  return user;
}
