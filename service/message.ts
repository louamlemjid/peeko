
import { Message, IMessage } from '@/model/message';
import dbConnect from "@/lib/mongoDB";
import { getUserByCode } from './user';
import '@/model/user'

/**
 * Send a message (user → user | admin → user | system → user)
 */
export async function sendMessage(params: {
  source: string;
  destination: string;
  content: string;
  sourceType?: 'USER' | 'ADMIN' | 'SYSTEM';
  meta?: Record<string, any>;
}): Promise<IMessage | null> {
  await dbConnect();

  try {
    const userSource = await getUserByCode(params.source)

    const userDestination = await getUserByCode(params.destination)

    const message = await Message.create({
      source: params.source,
      userSource:userSource?._id,
      destination: params.destination,
      userDestination: userDestination?._id,
      content: params.content,
      sourceType: params.sourceType ?? 'USER',
      meta: params.meta ?? {},
      opened: false,
    });

    return message;
  } catch (error) {
    console.error('sendMessage:', error);
    return null;
  }
}

export async function getInbox(userCode: string): Promise<IMessage[]> {
  await dbConnect();

  try {
    const inbox = await Message.aggregate([
      // 1️⃣ Only messages sent to this user
      {
        $match: {
          destination: userCode,
        },
      },

      // 2️⃣ Sort so newest messages come first
      {
        $sort: { createdAt: -1 },
      },

      // 3️⃣ Group by source (sender)
      {
        $group: {
          _id: "$userSource",
          lastMessage: { $first: "$$ROOT" },
        },
      },

      // 4️⃣ Replace root with the message document
      {
        $replaceRoot: { newRoot: "$lastMessage" },
      },

      // 5️⃣ Populate users
      {
        $lookup: {
          from: "users",
          localField: "userSource",
          foreignField: "_id",
          as: "userSource",
          pipeline: [
            { $project: { firstName: 1, lastName: 1 } },
          ],
        },
      },
      { $unwind: "$userSource" },

      {
        $lookup: {
          from: "users",
          localField: "userDestination",
          foreignField: "_id",
          as: "userDestination",
          pipeline: [
            { $project: { firstName: 1, lastName: 1 } },
          ],
        },
      },
      { $unwind: "$userDestination" },

      // 6️⃣ Final sort (optional)
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return inbox;
  } catch (error) {
    console.error("getInbox:", error);
    return [];
  }
}


export async function getConversation(
  userA: string,
  userB: string
): Promise<IMessage[]> {
  await dbConnect();

  try {
    // 1️⃣ Mark messages as opened (only messages received by userA)
    await Message.updateMany(
      {
        source: userB,
        destination: userA,
        opened: false,
      },
      {
        $set: { opened: true },
      }
    );

    // 2️⃣ Fetch full conversation
    const messages = await Message.find({
      $or: [
        { source: userA, destination: userB },
        { source: userB, destination: userA },
      ],
    })
      .populate({
        path: "userSource",
        select: "firstName lastName",
      })
      .populate({
        path: "userDestination",
        select: "firstName lastName",
      })
      .sort({ createdAt: 1 }) // chronological order
      .lean();

    return messages;
  } catch (error) {
    console.error("getConversation:", error);
    return [];
  }
}


export async function openMessage(
  userCode: string
): Promise<IMessage | null> {
  await dbConnect();

  try {
    const message = await Message.findOneAndUpdate(
      {
        destination: userCode,
        opened: false,
      },
      {
        $set: { opened: true },
      },
      {
        sort: { createdAt: 1 }, // oldest unread first
        new: true,              // return updated document
      }
    )
      .populate({
        path: "userSource",
        select: "firstName lastName",
      })
      .populate({
        path: "userDestination",
        select: "firstName lastName",
      })
      .lean();

    return message;
  } catch (error) {
    console.error("openMessage:", error);
    return null;
  }
}



