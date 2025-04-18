'use client';

import { ChatMessage } from '@/components/ui/features/chatMessage';
import { Message } from '@/types/message';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

export interface ScrumAssistantChatMessageProps {
  message: Message;
}

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
