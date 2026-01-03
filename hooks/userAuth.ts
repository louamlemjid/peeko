'use client';

import { IUser } from '@/model/user';
import { useEffect, useState } from 'react';



type UseUserAuthResult = {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useUserAuth(clerkId?: string): UseUserAuthResult {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!clerkId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/user/${clerkId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(res)
      if (!res.ok) {
        throw new Error(`Failed to fetch user (${res.status})`);
      }
      
      const data = await res.json();
      console.log(data)
      setUser(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkId]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
