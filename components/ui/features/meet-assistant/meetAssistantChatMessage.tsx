'use client';

import { ChatMessage } from '@/components/ui/features/chatMessage';
import type { Message } from '@/types/message';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

export interface MeetAssistantChatMessageProps {
  message: Message;
}

/**
 * A component that renders a chat message with an avatar for the Meet Assistant.
 *
 * @component
 * @param {Readonly<MeetAssistantChatMessageProps>} props - The props for the component.
 * @param {Message} props.message - The message object containing the sender and content.
 * @returns {JSX.Element} - Renders the `ChatMessage` component with customized styles and an avatar.
 *
 * @remarks
 * - This component is designed to display chat messages exchanged with the Meet Assistant.
 * - It uses the `ChatMessage` component to render the message content and applies specific styles for user and assistant messages.
 * - The avatar is dynamically rendered based on the sender (`assistant` or `user`).
 *
 * @example
 * ```tsx
 * <MeetAssistantChatMessage message={{ sender: 'assistant', content: 'Hello!' }} />
 * ```
 */
export function MeetAssistantChatMessage({ message }: Readonly<MeetAssistantChatMessageProps>) {
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
