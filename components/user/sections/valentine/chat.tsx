'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MessageCard from './messageCard';
import { IMessage } from '@/model/message';



interface ChatProps {
  userCode: string;
  name: string;
  avatarLetters: string;
  // online: boolean;
  initialMessages: IMessage[];
  currentUserCode: string;
}

interface DisplayMessage {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

const Chat: React.FC<ChatProps> = ({
  name,
  avatarLetters,
  // online,
  userCode,
  initialMessages,
  currentUserCode,
}) => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convert IMessage → DisplayMessage
  useEffect(() => {
    const converted = initialMessages.map((msg) => ({
      id: msg._id,
      text: msg.content,
      isMine: msg.source === currentUserCode,
      timestamp: new Date(msg.createdAt),
      status: msg.opened ? ('read' as const) : ('delivered' as const),
    }));
    setMessages(converted);
  }, [initialMessages, currentUserCode]);

  // Auto-scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
  };

  // Optimistically add message to UI
  setMessages((prev) => [...prev, optimisticMessage]);
  setInputText('');

  try {
    const res = await fetch('/api/v1/message/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: currentUserCode,
        destination: userCode, // the recipient's userCode from props
        content: newMsgText,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send message');
    }

    const data = await res.json();

    if (data.success && data.message) {
      const savedMessage: IMessage = data.message;

      // Replace optimistic message with real one from server
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId
            ? {
                id: savedMessage._id,
                text: savedMessage.content,
                isMine: true,
                timestamp: new Date(savedMessage.createdAt),
                status: 'delivered', // or 'read' if you mark on send
              }
            : m
        )
      );

      // Simulate "read" after a delay (optional – remove if recipient marks read later)
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === savedMessage._id ? { ...m, status: 'read' } : m
          )
        );
      }, 1500);
    } else {
      throw new Error(data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Send message error:', error);

    // Optionally: mark as failed or remove optimistic message
    setMessages((prev) =>
      prev.map((m) =>
        m.id === optimisticId ? { ...m, status: 'sent' } : m // keep as sent, or add 'failed'
      )
    );

    // You could show a toast: "Message failed to send"
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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Link href="/user/chat" className="lg:hidden">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Link>

          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {avatarLetters}
            </div>
            {/* {online && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white" />
            )} */}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
            {/* <p className="text-sm font-medium text-green-500">
              {online ? 'Online' : 'Offline'}
            </p> */}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[65vh] overflow-y-auto px-4 py-8 relative bg-primary/5">
        <div className="absolute inset-0 bg-chat-pattern opacity-5 pointer-events-none" />
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            text={message.text}
            isMine={message.isMine}
            status={message.status}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white shadow-2xl rounded-t-3xl px-5 py-5">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-3xl border-0 bg-gray-100 px-5 py-4 text-background focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all duration-200 placeholder:text-gray-500"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="rounded-full bg-primary p-4 text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <Send className="h-6 w-6" />
          </button>
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