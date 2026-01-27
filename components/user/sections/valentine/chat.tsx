'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, SmileIcon } from 'lucide-react';
import Link from 'next/link';
import MessageCard from './messageCard';
import { IMessage } from '@/model/message';
import PictureMessage from './imageMessage';
import Image from 'next/image';

interface ChatProps {
  userCode: string;
  name: string;
  avatarLetters: string;
  initialMessages: IMessage[];
  currentUserCode: string;
}

interface DisplayMessage {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  meta?: any;
}
type Animation = {
  _id: string;
  name: string;
  category: string;
  link: string;
  imageUrl: string;
};
const Chat: React.FC<ChatProps> = ({
  name,
  avatarLetters,
  userCode,
  initialMessages,
  currentUserCode,
}) => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showAnimationPicker, setShowAnimationPicker] = useState(false);
  const [selectedAnim,setSelectedAnim] = useState<Animation>()

const handleAnimationSelect = (animation: Animation) => {
  // Add to message composer, send API call, etc.
  setSelectedAnim(animation)
  setShowAnimationPicker(false);
};
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Detect keyboard open/close via visualViewport
  useEffect(() => {
    const handleViewportChange = () => {
      if (!window.visualViewport) return;

      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;

      // Heuristic: keyboard likely open if visual viewport shrinks significantly
      const likelyKeyboardOpen = viewportHeight < windowHeight * 0.75;
      setIsKeyboardOpen(likelyKeyboardOpen);
    };

    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener('resize', handleViewportChange);
      viewport.addEventListener('scroll', handleViewportChange);
    }

    window.addEventListener('resize', handleViewportChange);

    // Initial check
    handleViewportChange();

    return () => {
      if (viewport) {
        viewport.removeEventListener('resize', handleViewportChange);
        viewport.removeEventListener('scroll', handleViewportChange);
      }
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);
useEffect(() => {
  const el = document.getElementById('chat-messages');
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
}, [messages]);

  // Convert initial messages
  useEffect(() => {
    const converted = initialMessages.map((msg) => ({
      id: msg._id,
      text: msg.content,
      isMine: msg.source === currentUserCode,
      timestamp: new Date(msg.createdAt),
      status: msg.opened ? ('read' as const) : ('delivered' as const),
      meta:msg.meta
    }));
    setMessages(converted);
  }, [initialMessages, currentUserCode]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const newMsgText = inputText.trim();
    const optimisticId = Date.now().toString();

    const optimisticMessage: DisplayMessage = {
      id: optimisticId,
      text: newMsgText,
      isMine: true,
      timestamp: new Date(),
      status: 'sent',
      meta:selectedAnim
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText('');

    try {
      const res = await fetch('/api/v1/message/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: currentUserCode,
          destination: userCode,
          content: newMsgText,
          meta:selectedAnim
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      if (data.success && data.message) {
        const savedMessage: IMessage = data.message;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId
              ? {
                  id: savedMessage._id,
                  text: savedMessage.content,
                  isMine: true,
                  timestamp: new Date(savedMessage.createdAt),
                  status: 'delivered',
                  meta:savedMessage.meta
                }
              : m
          )
        );
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId ? { ...m, status: 'sent' } : m
        )
      );
      alert('Failed to send message. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[74dvh] bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Link href="/user/chat">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Link>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {avatarLetters}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        id="chat-messages"
        className="flex-1 overflow-y-auto px-4 py-6 bg-primary/5 relative"
      >
        <div className="absolute inset-0 bg-chat-pattern opacity-5 pointer-events-none" />
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            messageId={message.id}
            text={message.text}
            isMine={message.isMine}
            status={message.status}
            timestamp={message.timestamp}
            meta={message.meta}
          />
        ))}
        
      </div>

      {/* Input Area – padding increases when keyboard detected */}
      <div
        className="sticky bottom-0 bg-white px-5 py-4 shadow-2xl"
        style={{
          paddingBottom: isKeyboardOpen
            ? 'var(--input-area-height, 290px)' // adjust fallback if your input + button area is taller/shorter
            : 'env(safe-area-inset-bottom, 16px)',
          transition: 'padding-bottom 0.25s ease-out',
        }}
      >
        <div className="flex items-end gap-3 max-w-4xl mx-auto py-4">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="chat-input flex-1 resize-none rounded-3xl border-0 bg-gray-100 px-5 py-4 text-background focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-foreground transition-all duration-200 placeholder:text-gray-500"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '170px' }}
          />
          <div>
            {selectedAnim && (
            <Image src={selectedAnim.imageUrl} alt={selectedAnim.name} width={60} height={60} className='rounded-lg' />
          )}
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="rounded-full bg-primary p-4 text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <Send className="h-6 w-6" />
          </button>
          <div onClick={() => setShowAnimationPicker(true)}>
            <SmileIcon className="h-6 w-6" />
            <PictureMessage
              show={showAnimationPicker}
              onClose={() => setShowAnimationPicker(false)}
              onSelect={handleAnimationSelect}
            />
          </div>

        </div>
      </div>

      <style jsx global>{`
        .bg-chat-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default Chat;