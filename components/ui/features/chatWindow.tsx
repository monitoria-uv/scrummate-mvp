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
/**
 * Displays a scrollable chat window that fetches and renders messages for a specific chat.
 *
 * @component
 * @param {string} chatId - The unique identifier of the chat to display messages from.
 * @param {(chatId: string) => Promise<Message[]>} fetchMessages - An asynchronous function that takes a `chatId` and returns a Promise resolving to an array of `Message` objects.
 * @param {(input: string) => Promise<Message[]>} onSendMessage - An asynchronous function that takes the input string and sends a new message, returning a Promise resolving to the updated array of `Message` objects.
 * @param {number} refreshTrigger - A number that, when changed, triggers a re-fetch of the messages. This can be used for manual refresh mechanisms.
 * @param {string} [loadingLabel='Loading...'] - The label to display when messages are being fetched. Default: `Loading...`
 * @param {string} [emptyLabel='No messages yet.'] - The label to display when there are no messages in the chat. Default: `No messages yet.`
 * @param {(message: Message) => JSX.Element} [renderMessage] - An optional function that takes a `Message` object and returns a custom JSX element to render it. If not provided, the default `ChatMessage` component is used.
 * @returns {JSX.Element} - Renders a div containing the chat messages, a loading indicator, an empty state message, and optionally a scroll-to-bottom button.
 *
 * @remarks
 * - Uses `useEffect` to fetch messages when the `chatId` or `refreshTrigger` changes.
 * - Implements a scroll-to-bottom functionality, automatically scrolling to the latest message on new messages.
 * - Shows a "scroll to bottom" button when the user has scrolled away from the latest message.
 * - Utilizes a `ref` (`messagesRef`) to observe the scroll position and another `ref` (`bottomRef`) to mark the bottom of the message list.
 *
 * @example
 * ```tsx
 * <ChatWindow
 * chatId="123"
 * fetchMessages={async (id) => {
 * // Simulate fetching messages
 * return new Promise((resolve) =>
 * setTimeout(() => resolve([{ id: 1, sender: 'user', content: 'Hello!' }]), 500)
 * );
 * }}
 * onSendMessage={async (text) => {
 * // Simulate sending a message
 * console.log('Sending:', text);
 * return []; // Return updated messages
 * }}
 * refreshTrigger={refreshCount}
 * loadingLabel="Cargando mensajes..."
 * emptyLabel="No hay mensajes en este chat."
 * />
 * ```
 */
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

  /**
   * Scrolls the chat container to the bottom, making the most recent message visible.
   * Uses smooth scrolling behavior for a better user experience.
   *
   * @returns {void}
   */
  const sendScrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * useEffect hook that sets up an Intersection Observer to detect when the bottom of the message list
   * is visible within the scrollable message container. It updates the `showScrollButton` state
   * to control the visibility of the "scroll to bottom" button.
   *
   * @returns {() => void} - A cleanup function that disconnects the observer when the component unmounts.
   */
  useEffect(() => {
    if (!bottomRef.current || !messagesRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowScrollButton(!entry.isIntersecting),
      { root: messagesRef.current, threshold: 1.0 },
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [messages]);

  /**
   * useEffect hook that fetches messages for the current `chatId` when it changes, or when the
   * `refreshTrigger` prop is updated. It calls the `fetchMessages` function and updates the
   * `messages` state with the fetched data. It also handles potential errors during the fetch.
   *
   * @returns {void}
   */
  useEffect(() => {
    let active = true;
    fetchMessages(chatId)
      .then((msgs) => {
        if (active) setMessages(msgs);
      })
      .catch((e) => console.error('Error fetching messages:', e));
    return () => {
      active = false;
    };
  }, [chatId, fetchMessages, refreshTrigger]);
  /**
   * useEffect hook that automatically scrolls the chat to the bottom whenever the `messages` state updates.
   * This ensures that new messages are always visible to the user.
   *
   * @returns {void}
   */
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
