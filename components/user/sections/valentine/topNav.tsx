"use client"

import { useUserAuth } from "@/hooks/userAuth";
import { UserAuthProvider, useUserAuthContext } from "@/hooks/UserAuthProvider";
import { useUser } from "@clerk/nextjs";
import { MessageCircleMoreIcon,UserPlus2, Users, Voicemail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TopNav() {
  const { user, loading } = useUserAuthContext();
  const path = usePathname()
  console.log(path)
    return(
      <nav className="bg-primary border-t border-gray-200 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-around items-center h-16">
    
            <Link
              href="/user/chat"
              className={`flex flex-col items-center justify-center w-full h-full  transition-colors ${path === "/user/chat" ? "text-background" : "text-foreground"}`}
            >
              <MessageCircleMoreIcon size={24} strokeWidth={2} />
              <span className="text-xs mt-1">Messages</span>
            </Link>

            <Link
              href="/user/chat/friends"
              className={`flex flex-col items-center justify-center w-full h-full  transition-colors ${path === "/user/chat/friends" ? "text-background" : "text-foreground"}`}
            >
              <Users size={24} strokeWidth={2} />
              <span className="text-xs mt-1">Friends</span>
            </Link>

            <Link
              href="/user/chat/new"
              className={`flex flex-col items-center justify-center w-full h-full  transition-colors ${path === "/user/chat/new" ? "text-background" : "text-foreground"}`}
            >
              <UserPlus2 size={24} strokeWidth={2} />
              <span className="text-xs mt-1">Add Friend</span>
            </Link>

            <Link
              href="/user/chat/friendRequest"
              className={`flex flex-col items-center justify-center w-full h-full  transition-colors ${path === "/user/chat/friendRequest" ? "text-background" : "text-foreground"}`}
            >
              
              <Voicemail size={24} strokeWidth={2} />
               {!loading && user && user?.receivedPendingFriendRequests?.length > 0 && (
  <div className=" flex items-center justify-center min-w-6 h-6 p-1 bg-background text-primary text-xs font-bold rounded-full shadow-md">
    {user.receivedPendingFriendRequests.length > 99
      ? "99+"
      : user.receivedPendingFriendRequests.length}
  </div>
)}
              <span className="text-xs mt-1">Friend Requests</span>

             

            </Link>

           

           
          </div>
        </div>
      </nav>
    )
}