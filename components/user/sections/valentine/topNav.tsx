"use client"

import { MessageCircleMoreIcon,UserPlus2, Users, Voicemail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
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
              <span className="text-xs mt-1">Friend Requests</span>
            </Link>

           

           
          </div>
        </div>
      </nav>
    )
}