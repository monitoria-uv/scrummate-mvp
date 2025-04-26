'use client';

import { ChatMessage } from '@/components/ui/features/chatMessage';
import type { Message } from '@/types/message';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

export interface ScrumAssistantChatMessageProps {
  message: Message;
}
/**
 * A specialized chat message component tailored for the Scrum assistant, featuring custom avatars and styling.
 *
 * @component
 * @param {ScrumAssistantChatMessageProps} props - The props for the component.
 * @param {Message} props.message - The message object to be displayed.
 * @returns {JSX.Element} - Renders a `ChatMessage` component with specific avatars and styles for the Scrum assistant interaction.
 *
 * @remarks
 * - This component wraps the generic `ChatMessage` component, providing a consistent look and feel for messages exchanged with the Scrum assistant.
 * - It overrides the `renderAvatar` prop of `ChatMessage` to display a brain emoji (🧠) for assistant messages and a developer emoji (👨‍💻) for user messages.
 * - It also applies custom background and text alignment styles to differentiate user and assistant messages using the `messageStyles` prop of `ChatMessage`.
 *
 * @example
 * ```tsx
 * import type { Message } from '@/types/message';
 *
 * const userMessage: Message = {
 * id: '1',
 * sender: 'user',
 * text: 'What is the first step in Scrum?',
 * timestamp: new Date().toISOString(),
 * };
 *
 * const assistantMessage: Message = {
 * id: '2',
 * sender: 'assistant',
 * text: 'The first step in Scrum is to form a Scrum Team.',
 * timestamp: new Date().toISOString(),
 * };
 *
 * <ScrumAssistantChatMessage message={userMessage} />
 * <ScrumAssistantChatMessage message={assistantMessage} />
 * ```
 */
export function ScrumAssistantChatMessage({ message }: ScrumAssistantChatMessageProps) {
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
