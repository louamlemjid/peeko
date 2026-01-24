'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useUserAuth } from '@/hooks/userAuth'; // adjust path
import { formatDistanceToNow } from 'date-fns';
import { IMessage } from '@/model/message';
import { useUser } from '@clerk/nextjs';
import { IUser } from "@/model/user";
import { useLongPress } from '@/hooks/longPress';
import ConversationItem from './conversationItem';

function isUserPopulated(
  user: string | IUser
): user is IUser {
  return typeof user === "object" && user !== null && "firstName" in user;
}



interface ConversationPartner {
  userCode: string;
  name: string;
  avatarLetters: string;
  lastMessage: string;
  timestamp: Date;
  online: boolean;
  unreadCount: number;
}
 export const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

const UsersMap: React.FC = () => {
  const { user: clerkUser,isLoaded } = useUser();
  const clerkId = clerkUser?.id;

  const { user,loading:authLoading } = useUserAuth(clerkId);
    const currentUserCode = user?.userCode

  const [conversations, setConversations] = useState<ConversationPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [selectedConvo, setSelectedConvo] = useState(null);

 

  const fetchInbox = async () => {
        console.log(currentUserCode,authLoading)
    if (!currentUserCode || authLoading) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/v1/message/inbox/${currentUserCode}`);

        if (!res.ok) {
          throw new Error('Failed to load messages');
        }

        const data = await res.json();
        console.log(data)

        if (!data.success) {
          throw new Error(data.error || 'No messages found');
        }

       const messages: IMessage[] = data.messages;

        // Group by conversation partner
        const grouped = new Map<string, IMessage[]>();

        messages.forEach((msg) => {
          const partnerCode =
            msg.source === currentUserCode ? msg.destination : msg.source;

          if (!grouped.has(partnerCode)) {
            grouped.set(partnerCode, []);
          }

          grouped.get(partnerCode)!.push(msg);
        });

        const convos: ConversationPartner[] = [];

        for (const [partnerCode, msgs] of grouped) {
          // Sort messages newest first
          msgs.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

          const latestMsg = msgs[0];

          const rawPartner =
          latestMsg.source === currentUserCode
            ? latestMsg.userDestination
            : latestMsg.userSource;

        const partnerUser = isUserPopulated(rawPartner)
          ? rawPartner
          : null;


          // Count unread messages RECEIVED by current user
          const unreadCount = msgs.filter(
            (m) =>
              m.destination === currentUserCode &&
              !m.opened
          ).length;

        convos.push({
          userCode: partnerCode,
          name: partnerUser
            ? `${partnerUser.firstName} ${partnerUser.lastName}`
            : partnerCode,
          avatarLetters: partnerUser
            ? `${partnerUser.firstName[0]}${partnerUser.lastName[0]}`.toUpperCase()
            : partnerCode.slice(0, 2).toUpperCase(),
          lastMessage: latestMsg.content,
          timestamp: new Date(latestMsg.createdAt),
          online: false,
          unreadCount,
        });

        }

        // Sort conversations by last activity
        convos.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );

        setConversations(convos);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    
    

    fetchInbox();
  }, [currentUserCode, authLoading]);



  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          conversations.map((convo) => (
            <ConversationItem key={convo.userCode} convo={convo} />
          ))
        )}
      </div>

      {/* Floating New Message Button */}
      <Link
        href="/user/chat/friends"
        className="fixed bottom-20 right-6 bg-primary text-white rounded-full p-4 shadow-2xl hover:bg-primary/90 transition-all hover:scale-110"
        aria-label="New message"
      >
        <MessageCircle className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default UsersMap;