
import { Message, IMessage } from '@/model/message';
import dbConnect from "@/lib/mongoDB";

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
    const message = await Message.create({
      source: params.source,
      destination: params.destination,
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
    return await Message.find({ destination: userCode })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error('getInbox:', error);
    return [];
  }
}

export async function getConversation(
  userA: string,
  userB: string
): Promise<IMessage[]> {
  await dbConnect();

  try {
    return await Message.find({
      $or: [
        { source: userA, destination: userB },
        { source: userB, destination: userA },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();
  } catch (error) {
    console.error('getConversation:', error);
    return [];
  }
}

export async function openMessage(
  userCode: string
): Promise<boolean> {
  await dbConnect();

  try {
    const res = await Message.findOneAndUpdate(
      {
        destination: userCode,
        opened: false,
      },
      {
        $set: { opened: true },
      },
      {
        sort: { createdAt: 1 }, // oldest unread first
      }
    );

    return !!res;
  } catch (error) {
    console.error('openMessage:', error);
    return false;
  }
}


