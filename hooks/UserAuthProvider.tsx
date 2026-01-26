"use client";

import { createContext, useContext } from "react";
import { IUser } from "@/model/user";
import { useUserAuth } from "@/hooks/userAuth";

type UserAuthContextType = {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export function UserAuthProvider({
  clerkId,
  children,
}: {
  clerkId?: string;
  children: React.ReactNode;
}) {
  const auth = useUserAuth(clerkId);

  return (
    <UserAuthContext.Provider value={auth}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuthContext() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error("useUserAuthContext must be used inside UserAuthProvider");
  }
  return ctx;
}
