'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserAuth } from '@/hooks/userAuth';
import { UserCheck, Clock, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

type FriendRequestUser = {
  _id: string;
  userCode: string;
  firstName?: string | null;
  lastName?: string | null;
  // you can add sentAt / createdAt if your populate includes timestamps
};

export default function FriendRequestsPage() {
  const { user: clerkUser } = useUser();
  const { user: currentUser, loading: authLoading,refetch } = useUserAuth(clerkUser?.id);

  const [processing, setProcessing] = useState<string | null>(null); // _id of request being accepted

  const requests = currentUser?.receivedPendingFriendRequests || []; // ← use the field you actually have
  // If the field is called pendingFriendRequests instead, change to:
  // const requests = currentUser?.pendingFriendRequests || [];

  const handleAccept = async (friendId: string) => {
    if (!clerkUser?.id || processing) return;

    setProcessing(friendId);

    try {
      const res = await fetch(`/api/v1/user/acceptFriendRequest/${friendId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: clerkUser.id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to accept');
      }

      // Optimistic update: remove from list immediately
      // (the real update happens on server → you can refetch user if needed)
      // For simplicity here we just remove it locally
      toast.success('Friend request accepted!');
      refetch();
      // Optional: force refresh user data via your auth hook or context
      // or leave it — next navigation/page reload will show updated friends

    } catch (err: any) {
      console.error('Accept error:', err);
      alert(err.message || 'Something went wrong');
    } finally {
      setProcessing(null);
    }
  };

  const getDisplayName = (user: FriendRequestUser) => {
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return full || user.userCode;
  };

  const getAvatarLetters = (user: FriendRequestUser) => {
    if(!user)return
    if (user.firstName) {
      const initials = `${user.firstName[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
      if (initials) return initials;
    }
    return user.userCode.slice(0, 2).toUpperCase();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4 opacity-60" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No pending requests</h3>
            <p className="text-gray-500">
              When someone sends you a friend request, it will show up here.
            </p>
            <Link
              href="/user/chat/new"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Find people to add
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req: any) => (
              <div
                key={req._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between hover:shadow transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl shadow-sm">
                    {getAvatarLetters(req)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getDisplayName(req)}
                    </h3>
                    <p className="text-sm text-gray-600">@{req.userCode}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAccept(req._id)}
                  disabled={processing === req._id}
                  className={`
                    min-w-[110px] px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                    ${
                      processing === req._id
                        ? 'bg-gray-200 text-gray-600 cursor-wait'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }
                  `}
                >
                  {processing === req._id ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Accept
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}