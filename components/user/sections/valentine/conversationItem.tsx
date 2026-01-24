import { useLongPress } from "@/hooks/longPress";
import Link from "next/link";
import { formatTime } from "./UsersMap";
import { useState } from "react";
import PopupOptions from "./ConvoPopupOptions";

export default function ConversationItem({ convo }: { convo: any }) {
    const [showPopup,setShowPopup] = useState(false)
    const [convoCode,setConvoCode] = useState("")

  const { handlers, isLongPress } = useLongPress(() => {
    console.log("Long pressed:", convo.userCode);
    setConvoCode(convo.userCode)
    setShowPopup(true)
  }, 600);

  return (
    <div
      {...handlers}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
       if (isLongPress.current) {
        e.preventDefault();
        e.stopPropagation();
      }
      }}
    >
      <Link
        href={`/user/chat/${convo.userCode}`}
        className="block hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-4 px-6 py-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {convo.avatarLetters}
            </div>
            {convo.online && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {convo.name}
              </h3>
              <span className="text-sm text-gray-500">
                {formatTime(convo.timestamp)}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate mt-1">
              {convo.lastMessage}
            </p>
          </div>

          {/* Unread Badge */}
          {convo.unreadCount > 0 && (
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-white text-sm font-bold rounded-full shadow-md">
              {convo.unreadCount > 99 ? "99+" : convo.unreadCount}
            </div>
          )}
        </div>
      </Link>
      <PopupOptions
        show={showPopup}
        convoCode={convoCode}
        onClose={() => setShowPopup(false)}
        />
    </div>
  );
}
