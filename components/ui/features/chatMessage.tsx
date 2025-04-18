import { Message } from '@/types/message';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  message: Message;
  renderAvatar?: (sender: Message['sender']) => React.ReactNode;
  className?: string;
  messageStyles?: {
    user?: string;
    assistant?: string;
  };
  contentClassName?: string;
}

export function ChatMessage({
  message,
  renderAvatar,
  className,
  messageStyles,
  contentClassName,
}: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const defaultAvatar = (
    <Avatar className="h-8 w-8">
      <AvatarFallback>{isUser ? '👤' : '🤖'}</AvatarFallback>
    </Avatar>
  );

  return (
    <div
      className={cn(
        'flex w-full gap-2 items-start',
        isUser ? 'justify-end' : 'justify-start',
        className,
      )}
    >
      {!isUser && (renderAvatar?.(message.sender) ?? defaultAvatar)}

      <Card
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
          isUser
            ? (messageStyles?.user ?? 'bg-blue-100 dark:bg-blue-900 text-right')
            : (messageStyles?.assistant ?? 'bg-muted text-left'),
        )}
      >
        <CardContent className={cn('p-0', contentClassName)}>
          <Markdown>{message.text}</Markdown>
          <div className="text-xs text-muted-foreground mt-1 text-right">{timestamp}</div>
        </CardContent>
      </Card>

      {isUser && (renderAvatar?.(message.sender) ?? defaultAvatar)}
    </div>
  );
}
