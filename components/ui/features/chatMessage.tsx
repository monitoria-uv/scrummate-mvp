import { Message } from '@/types/message';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('flex w-full gap-2 items-start', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>🤖</AvatarFallback>
        </Avatar>
      )}

      <Card
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
          isUser ? 'bg-blue-100 dark:bg-blue-900 text-right' : 'bg-muted text-left',
        )}
      >
        <CardContent className="p-0">
          <Markdown>{message.text}</Markdown>
          <div className="text-xs text-muted-foreground mt-1 text-right">{timestamp}</div>
        </CardContent>
      </Card>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>👤</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
