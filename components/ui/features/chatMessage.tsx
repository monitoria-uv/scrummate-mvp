import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Message } from '@/types/message';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`p-2 rounded max-w-[75%] ${
        isUser ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-100 self-start mr-auto'
      }`}
    >
      <p className="text-sm">{message.text}</p>
      <p className="text-xs text-gray-400 text-right">
        {new Date(message.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}
