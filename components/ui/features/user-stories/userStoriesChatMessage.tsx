'use client';

import { ChatMessage } from '@/components/ui/features/chatMessage';
import type { Message } from '@/types/message';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

export interface UserStoriesChatMessageProps {
  message: Message;
}

/**
 * A specialized chat message component tailored for the User Stories assistant,
 * featuring custom avatars and styling for this specific context.
 *
 * @component
 * @param {UserStoriesChatMessageProps} props - The props for the component.
 * @param {Message} props.message - The message object to be displayed.
 * @returns {JSX.Element} - Renders a `ChatMessage` component with specific avatars and styles
 * for the User Stories assistant interaction.
 *
 * @remarks
 * - This component wraps the generic `ChatMessage` component, providing a consistent
 *   look and feel for messages exchanged with the User Stories assistant.
 * - It overrides the `renderAvatar` prop of `ChatMessage` to display a 📄 icon for assistant messages
 *   and a 🧑‍💻 icon for user messages.
 * - Applies custom background and alignment styles via `messageStyles`.
 *
 * @example
 * ```tsx
 * <UserStoriesChatMessage message={message} />
 * ```
 */
export function UserStoriesChatMessage({ message }: UserStoriesChatMessageProps) {
  const renderAvatar = (sender: Message['sender']) => (
    <Avatar className="h-8 w-8">
      <AvatarFallback>{sender === 'assistant' ? '📄' : '🧑‍💻'}</AvatarFallback>
    </Avatar>
  );

  return (
    <ChatMessage
      message={message}
      renderAvatar={renderAvatar}
      messageStyles={{
        user: 'bg-purple-100 dark:bg-purple-900 text-right',
        assistant: 'bg-indigo-100 dark:bg-indigo-900 text-left',
      }}
    />
  );
}
