import { Heart, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
    return(
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-around items-center h-16">
            {/* Message / Chat */}
            <Link
              href="/user/chat"
              className="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MessageCircle size={24} strokeWidth={2} />
              <span className="text-xs mt-1">Chat</span>
            </Link>

            {/* Animation Sets */}
            <Link
              href="/user/animationSets"
              className="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Sparkles size={24} strokeWidth={2} />
              <span className="text-xs mt-1">Animations</span>
            </Link>

            {/* Collection */}
            <Link
              href="/user/collection"
              className="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Heart size={24} strokeWidth={2} />
              <span className="text-xs mt-1">Collection</span>
            </Link>
          </div>
        </div>
      </nav>
    )
}