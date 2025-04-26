'use client';

import { ChatMessage } from '@/components/ui/features/chatMessage';
import type { Message } from '@/types/message';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

export interface GoodPracticesChatMessageProps {
  message: Message;
}

/**
 * A component that renders a chat message with specific styles and an avatar for good practices discussions.
 *
 * @component
 * @param {GoodPracticesChatMessageProps} props - The props for the component.
 * @param {Message} props.message - The message object containing the sender and content.
 * @returns {JSX.Element} - Renders the `ChatMessage` component with customized styles and avatars.
 *
 * @remarks
 * - This component is designed to display chat messages with distinct styles for user and assistant roles.
 * - It uses the `ChatMessage` component and provides custom avatar rendering and message styles.
 * - The avatar displays an emoji based on the sender: 🧠 for the assistant and 👨‍💻 for the user.
 *
 * @example
 * ```tsx
 * <GoodPracticesChatMessage message={{ sender: 'assistant', content: 'Follow good practices!' }} />
 * ```
 */
export function GoodPracticesChatMessage({ message }: Readonly<GoodPracticesChatMessageProps>) {
  const renderAvatar = (sender: Message['sender']) => (
    <Avatar className="h-8 w-8">
      <AvatarFallback>{sender === 'assistant' ? '🧠' : '👨‍💻'}</AvatarFallback>
    </Avatar>
  );

  return (
    <ChatMessage
      message={message}
      renderAvatar={renderAvatar}
      messageStyles={{
        user: 'bg-yellow-100 dark:bg-yellow-900 text-right',
        assistant: 'bg-green-100 dark:bg-green-900 text-left',
      }}
    />
  );
}
