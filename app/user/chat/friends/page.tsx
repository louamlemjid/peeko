'use client';

import Link from 'next/link';
import {  Users, MessageCircle} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useUserAuth } from '@/hooks/userAuth'; 

// Assuming this type from your model
type UserSearchResult = {
  _id: string;
  userCode: string;
  firstName?: string | null;
  lastName?: string | null;
};

export default function Friends() {
  const { user: clerkUser } = useUser();
  const { user: currentUser } = useUserAuth(clerkUser?.id);

  const friends = currentUser?.friends || [];
  

  const getDisplayName = (user: UserSearchResult) => {
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return full || user.userCode;
  };

  const getAvatarLetters = (user: UserSearchResult) => {
    if (user.firstName) {
      const initials = `${user.firstName[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
      if (initials) return initials;
    }
    return user.userCode.slice(0, 2).toUpperCase();
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 max-w-2xl mx-auto w-full space-y-10">
      
        {/* Friends List Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Friends {friends.length > 0 && `(${friends.length})`}
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
            {friends.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p className="text-lg font-medium">No friends yet</p>
                <p className="mt-2">Add friends to start chatting</p>
              </div>
            ) : (
              friends.map((friend: any) => (
                <Link
                  key={friend.userCode}
                  href={`/user/chat/${friend.userCode}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {getAvatarLetters(friend)}
                    </div>
                    {friend.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {getDisplayName(friend)}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">@{friend.userCode}</p>
                  </div>
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}