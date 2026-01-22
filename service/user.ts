import crypto from "crypto";
import { IUser, User } from "@/model/user";
import "@/model/peeko"; 
import '@/model/animationSet';
import '@/model/animation';
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

export async function getAnimationSet(
  clerkId: string
): Promise<IUser['animationSets'] | null> {
  await dbConnect();

  try {
    const user = await User.findOne({ clerkId })
      .populate({
        path: 'animationSets',
        populate: {
          path: 'animations',
          model: 'Animation', // optional but recommended
        },
      })
      .lean();

    return user ? (user.animationSets as IUser['animationSets']) : null;
  } catch (error) {
    console.error('service/user:', error);
    return null;
  }
}

/**
 * Send a friend request
 * - Adds the receiver's ID to sender's pendingFriendRequests (if not already present)
 * - Does NOT add anything to the receiver yet (one-sided request)
 */
export async function sendFriendRequest(
  senderClerkId: string,
  friendId: string      // <-- this is the _id of the receiver (ObjectId string)
): Promise<IUser | null> {
  await dbConnect();
  try {
    // Prevent self-request and already-friends/already-pending cases can be handled
    // either here or in frontend – minimal version below

    const updatedSender = await User.findOneAndUpdate(
      {
        clerkId: senderClerkId
      },
      {
        $addToSet: { pendingFriendRequests: friendId },
      },
      { new: true, lean: true }
    );

    if (!updatedSender) {
      // Either user not found, or was already friend/pending/self
      return null;
    }

    return JSON.parse(JSON.stringify(updatedSender));
  } catch (error) {
    console.error("service/user sendFriendRequest:", error);
    return null;
  }
}

/**
 * Accept a friend request
 * - Adds friendId to receiver's friends list
 * - Adds receiver's own _id to sender's friends list (symmetrical friendship)
 * - Removes friendId from receiver's pendingFriendRequests
 */
export async function acceptFriendRequest(
  receiverClerkId: string,
  friendId: string      // <-- this is the _id of the sender (who sent the request)
): Promise<IUser | null> {
  await dbConnect();
  try {
    // We'll do this in two updates (atomicity per document)
    // 1. Update receiver: remove from pending + add to friends
    // 2. Update sender: add receiver to friends

    const receiverObjectId = friendId; // rename for clarity
    const receiver = await User.findOne({ clerkId: receiverClerkId }).lean();

    if (!receiver) return null;

    const receiverId = receiver._id.toString();

    // Update receiver
    const updatedReceiver = await User.findByIdAndUpdate(
      receiver._id,
      {
        $pull: { pendingFriendRequests: receiverObjectId },
        $addToSet: { friends: receiverObjectId },
      },
      { new: true, lean: true }
    );

    if (!updatedReceiver) return null;

    // Update sender (mutual friendship)
    await User.findByIdAndUpdate(
      receiverObjectId,
      {
        $addToSet: { friends: receiverId },
      },
      { new: true } // we don't need the result here
    );

    return JSON.parse(JSON.stringify(updatedReceiver));
  } catch (error) {
    console.error("service/user acceptFriendRequest:", error);
    return null;
  }
}