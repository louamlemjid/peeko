// components/Chat.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import MessageCard from './messageCard';

interface Message {
  id: number;
  text: string;
  isMine: boolean;
  status: 'sent' | 'delivered' | 'read';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hey! How are you doing?',
      isMine: false,
      status: 'read',
    },
    {
      id: 2,
      text: 'I\'m great, thanks! Just working on some new animations 😄',
      isMine: true,
      status: 'read',
    },
    {
      id: 3,
      text: 'That sounds awesome! Can\'t wait to see them.',
      isMine: false,
      status: 'read',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      isMine: true,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate status progression
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[90vh] bg-white">
      {/* Modern Rounded Header */}
      <div className="bg-white shadow-sm  px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg">
            JD
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
            <p className="text-sm text-green-500 font-medium">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area with subtle background pattern */}
      <div className="flex-1 overflow-y-auto px-4 py-8 relative bg-primary/80">
        <div className="absolute inset-0 bg-chat-pattern opacity-5 pointer-events-none" />
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            text={message.text}
            isMine={message.isMine}
            status={message.status}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Area with rounded design */}
      <div className="bg-white shadow-2xl rounded-t-3xl px-5 py-5">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-3xl border-0 bg-gray-100 px-5 py-4 text-base focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all duration-200 placeholder:text-gray-500"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={inputText.trim() === ''}
            className="rounded-full bg-primary p-4 text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            aria-label="Send message"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Optional CSS for chat background pattern (add to globals if needed) */}
      <style jsx global>{`
        .bg-chat-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default Chat;