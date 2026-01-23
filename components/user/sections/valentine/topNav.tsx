import { Heart, Home, MessageCircle, MessageCircleMoreIcon, MessageCirclePlus, Sparkles, Voicemail } from "lucide-react";
import Link from "next/link";

export default function TopNav() {
    return(
      <nav className="bg-primary border-t border-gray-200 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-around items-center h-16">
            {/* Message / Chat */}
            <Link
              href="/user/chat"
              className="flex flex-col items-center justify-center w-full h-full text-foreground transition-colors"
            >
              <MessageCircleMoreIcon size={24} strokeWidth={2} />
              <span className="text-xs mt-1">Messages</span>
            </Link>

             {/* Animation Sets */}
            <Link
              href="/user/chat/new"
              className="flex flex-col items-center justify-center w-full h-full text-foreground hover:text-blue-600 transition-colors"
            >
              <MessageCirclePlus size={24} strokeWidth={2} />
              <span className="text-xs mt-1">New Message</span>
            </Link>

            {/* Message / Chat */}
            <Link
              href="/user/chat/friendRequest"
              className="flex flex-col items-center justify-center w-full h-full text-foreground hover:text-blue-600 transition-colors"
            >
              <Voicemail size={24} strokeWidth={2} />
              <span className="text-xs mt-1">Friend Request</span>
            </Link>

           

           
          </div>
        </div>
      </nav>
    )
}