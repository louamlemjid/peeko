'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Chat from '@/components/user/sections/valentine/chat';
import { useUserAuth } from '@/hooks/userAuth'; // adjust path as needed
import { notFound } from 'next/navigation';
import { IMessage } from '@/model/message';
import { useUser } from '@clerk/nextjs';





export default function ChatPage() {
  const params = useParams();
  const userCode = params.userCode as string;
console.log(userCode)
  const { user: clerkUser,isLoaded } = useUser();
  const clerkId = clerkUser?.id;

  const { user,loading:authLoading } = useUserAuth(clerkId);
    const currentUserCode = user?.userCode
  const [otherUser, setOtherUser] = useState("")
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
console.log(currentUserCode)
  useEffect(() => {
    if (!userCode || !currentUserCode || authLoading) return;

    const fetchChatData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch conversation messages
        const convRes = await fetch('/api/v1/message/conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userA: currentUserCode,
            userB: userCode,
          }),
        });

        if (!convRes.ok) throw new Error('Failed to load messages');

        const convData = await convRes.json();
        console.log(convData.messages)
        if (!convData.success) throw new Error(convData.message || 'No messages');

        setMessages(convData.messages || []);

        const userres = await fetch("/api/v1/user/userCode/"+userCode)
        if (!userres.ok) throw new Error('Failed to fetch other user');

        const userData = await userres.json()

        setOtherUser(userData.user.firstName+" "+userData.user.lastName)
        
      } catch (err: any) {
        console.error(err);
        setError(err || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [userCode, currentUserCode, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  if (error ) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500">Error: {error || 'User not found'}</p>
      </div>
    );
  }

  return (
    <Chat
      userCode={userCode}
      name={otherUser}
      avatarLetters={otherUser[0]+otherUser[otherUser.length-1].toLocaleUpperCase()}
    //   online={otherUser.online}
      initialMessages={messages}
      currentUserCode={currentUserCode!}
    />
  );
}