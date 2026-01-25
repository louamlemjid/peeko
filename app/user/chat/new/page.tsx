'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPlus, Users, MessageCircle, Clock, UserCheck, ArrowUpRightFromSquare, ArrowLeft } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useUserAuth } from '@/hooks/userAuth'; // your custom hook
import { toast } from 'react-toastify';

// Assuming this type from your model
type UserSearchResult = {
  _id: string;
  userCode: string;
  firstName?: string | null;
  lastName?: string | null;
};

export default function NewChatPage() {
  const { user: clerkUser } = useUser();
  const { user: currentUser, loading: authLoading,refetch } = useUserAuth(clerkUser?.id);

  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const friends = currentUser?.friends || [];
  const pendingFriends = currentUser?.sentPendingFriendRequests || [];
  const currentUserId = currentUser?._id;

  

  // Debounced search
  useEffect(() => {
    if (searchValue.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSearch(true);
      setSearchError(null);

      try {
        const res = await fetch(`/api/v1/user/search?q=${encodeURIComponent(searchValue)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setSearchResults(data.users || []);
      } catch (err: any) {
        console.error(err);
        setSearchError('Could not search users');
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const isAlreadyFriend = (targetId: string) =>
    friends.some((f: any) => 
        f._id === targetId 
    );

  const isSent = (targetId: string) =>
  pendingFriends.some((f: any) =>
    typeof f === "string" ? f === targetId : false
  );



  const isSelf = (targetId: string) => targetId === currentUserId;

  const handleAddFriend = async (targetId: string) => {
    if (!targetId || !clerkUser?.id) return;
    if (isSelf(targetId) || isAlreadyFriend(targetId)) return;

    try {
      const res = await fetch(`/api/v1/user/sendFriendRequest/${targetId}`, {
        method: 'PATCH',
        body:JSON.stringify({clerkId:clerkUser?.id}),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to send request');
        return;
      }

      toast.success('Friend request sent!');
      refetch();
      // Optional: refresh currentUser / friends list here
      // or show "Pending" state locally (more advanced)

    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

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

  const getFriendButton = (user: UserSearchResult) => {
    console.log(pendingFriends)
    if (isSelf(user._id)) {
      return (
        <button
          disabled
          className="px-5 py-2 text-sm bg-gray-200 text-gray-600 rounded-full cursor-not-allowed"
        >
          You
        </button>
      );
    }
    if (isAlreadyFriend(user._id)) {
      return (
        <button
          disabled
          className="px-5 py-2 text-sm bg-green-100 text-green-700 rounded-full flex items-center gap-1.5"
        >
          <UserCheck size={16} /> Friend
        </button>
      );
    }
    if (isSent(user._id)) {
      return (
        <button
          disabled
          className="px-5 py-2 text-sm bg-blue-100 text-green-700 rounded-full flex items-center gap-1.5"
        >
          <ArrowUpRightFromSquare size={16} /> Pending
        </button>
      );
    }
    // Here you could also check pending requests if you expose them
    return (
      <button
        onClick={() => handleAddFriend(user._id)}
        className="px-5 py-2 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors font-medium"
      >
        Add
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 max-w-2xl mx-auto w-full space-y-10">
        {/* Add Friend Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add Friend</h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-gray-50">
              <p className="text-sm text-gray-600">
                Send a friend request using their Peeko code or name
              </p>
            </div>

            <div className="p-5 space-y-5">
              {/* Search input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Peeko code (e.g. A1B2C3) or name"
                  className="flex-1 px-4 py-3 bg-foreground border border-gray-300 rounded-lg  focus:ring-2 focus:primary focus:border-primary transition-all text-background placeholder:tracking-normal"
                />
              </div>

              {/* Search results / suggestions */}
              <div className="pt-2 min-h-[200px]">
                {loadingSearch ? (
                  <p className="text-center text-gray-500 py-8">Searching...</p>
                ) : searchError ? (
                  <p className="text-center text-red-600 py-8">{searchError}</p>
                ) : searchResults.length === 0 && searchValue.length >= 2 ? (
                  <p className="text-center text-gray-500 py-8">No users found</p>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl shadow-sm">
                            {getAvatarLetters(user)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{getDisplayName(user)}</p>
                            <p className="text-sm text-gray-500">@{user.userCode}</p>
                          </div>
                        </div>
                        {getFriendButton(user)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Type a name or Peeko code to find users
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

       
      </div>
    </div>
  );
}