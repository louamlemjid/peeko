"use client"
// components/MessageCard.tsx
import React, { useState } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { useLongPress } from '@/hooks/longPress';
import MessagePopupOptions from './messgePopupOptions';
import Image from 'next/image';

interface MessageCardProps {
  /** The message text */
  text: string;
  /** Whether this is sent by the current user (right-aligned) */
  isMine: boolean;
  messageId:string;
  meta:any;
  /** Message status: 'sent' = single check, 'delivered' = double check, 'read' = double check blue */
  status?: 'sent' | 'delivered' | 'read';
  /** Optional timestamp */
  timestamp?: Date;
}

const MessageCard: React.FC<MessageCardProps> = ({
  text,
  isMine,
  status = 'read',
  timestamp = '12:34',
  messageId,
  meta
}) => {
  const statusColor = status === 'read' ? 'text-white' : 'text-gray-500';
const [showPopup,setShowPopup] = useState(false)
    

  const { handlers, isLongPress } = useLongPress(() => {
    console.log("Long pressed:", messageId);
    
    setShowPopup(true)
  }, 600);
  return (
    <div {...handlers}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
       if (isLongPress.current) {
        e.preventDefault();
        e.stopPropagation();
      }
      }}
       className={`flex mb-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl relative ${
          isMine
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed">{text}</p>

         <div>
            {meta && meta.imageUrl && (
              <Image src={meta.imageUrl} alt={meta.name} width={160} height={160} className='rounded-lg' />
            )}
         </div>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">{timestamp.toLocaleString()}</span>
          {isMine && (
            <>
              {status === 'sent' ? (
                <Check className={`h-4 w-4 ${statusColor}`} />
              ) : (
                <CheckCheck
                  className={`h-4 w-4 ${statusColor} ${
                    status === 'read' ? 'fill-current' : ''
                  }`}
                />
              )}
            </>
          )}
        </div>
      </div>
       <MessagePopupOptions
        show={showPopup}
        messageId={messageId}
        onClose={() => setShowPopup(false)}
        />
    </div>
  );
};

export default MessageCard;