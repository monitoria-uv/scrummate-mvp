'use client';

import type { JSX } from 'react';
import { useEffect, useState, useRef } from 'react';
import type { Message } from '@/types/message';
import { ChatMessage } from '@/components/ui/features/chatMessage';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export interface ChatWindowProps {
  chatId: string;
  fetchMessages: (chatId: string) => Promise<Message[]>;
  onSendMessage: (input: string) => Promise<Message[]>;
  refreshTrigger: number;
  loadingLabel?: string;
  emptyLabel?: string;
  renderMessage?: (message: Message) => JSX.Element;
}

export function ChatWindow({
  chatId,
  fetchMessages,
  onSendMessage,
  refreshTrigger,
  loadingLabel,
  emptyLabel,
  renderMessage,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendScrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!bottomRef.current || !messagesRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowScrollButton(!entry.isIntersecting),
      { root: messagesRef.current, threshold: 1.0 },
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [messages]);

  useEffect(() => {
    fetchMessages(chatId)
      .then(setMessages)
      .catch((error) => console.error('Error fetching messages:', error));
  }, [chatId, fetchMessages, refreshTrigger]);

  useEffect(() => {
    sendScrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.length === 0 && !loading ? (
          <div className="text-center text-gray-500 mt-20">{emptyLabel}</div>
        ) : (
          <>
            {messages.map((msg) =>
              renderMessage ? (
                renderMessage(msg)
              ) : (
                <ChatMessage key={msg.id.toString()} message={msg} />
              ),
            )}
            {loading && <div className="italic text-gray-500">{loadingLabel}</div>}
            <div ref={bottomRef} />
          </>
        )}

        {showScrollButton && (
          <div className="absolute bottom-[150px] right-4 z-20">
            <Button
              onClick={sendScrollToBottom}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 w-12 shadow-lg transition-all duration-200"
              variant="default"
              size="icon"
              aria-label="Ir al final"
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
