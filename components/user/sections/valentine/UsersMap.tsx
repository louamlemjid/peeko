'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useUserAuth } from '@/hooks/userAuth'; // adjust path
import { formatDistanceToNow } from 'date-fns';
import { IMessage } from '@/model/message';
import { useUser } from '@clerk/nextjs';
import { IUser } from "@/model/user";

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

const UsersMap: React.FC = () => {
  const { user: clerkUser,isLoaded } = useUser();
  const clerkId = clerkUser?.id;

  const { user,loading:authLoading } = useUserAuth(clerkId);
    const currentUserCode = user?.userCode

  const [conversations, setConversations] = useState<ConversationPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

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
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-5 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          conversations.map((convo) => (
            <Link
              key={convo.userCode}
              href={`/user/chat/${convo.userCode}`}
              className="block hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4 px-6 py-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {convo.avatarLetters}
                  </div>
                  {convo.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {convo.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatTime(convo.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {convo.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {convo.unreadCount > 0 && (
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-white text-sm font-bold rounded-full shadow-md">
                    {convo.unreadCount > 99 ? '99+' : convo.unreadCount}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Floating New Message Button */}
      <Link
        href="/user/chat/new"
        className="fixed bottom-20 right-6 bg-primary text-white rounded-full p-4 shadow-2xl hover:bg-primary/90 transition-all hover:scale-110"
        aria-label="New message"
      >
        <MessageCircle className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default UsersMap;