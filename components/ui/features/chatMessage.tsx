import type { Message } from '@/types/message';
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
/**
 * Renders a single chat message, displaying the sender, content, and timestamp.
 *
 * @component
 * @param {Message} message - The message object containing the sender, text content, and timestamp.
 * @param {(sender: Message['sender']) => React.ReactNode} [renderAvatar] - An optional function to render a custom avatar based on the message sender. If not provided, a default avatar (👤 for user, 🤖 for assistant) is used.
 * @param {string} [className] - Optional CSS class names to apply to the main message container.
 * @param {object} [messageStyles] - Optional styles to customize the appearance of user and assistant messages.
 * @param {string} [messageStyles.user] - CSS class names to apply specifically to user messages. Default: `bg-blue-100 dark:bg-blue-900 text-right`
 * @param {string} [messageStyles.assistant] - CSS class names to apply specifically to assistant messages. Default: `bg-muted text-left`
 * @param {string} [contentClassName] - Optional CSS class names to apply to the content area of the message card.
 * @returns {JSX.Element} - Renders a div containing the sender's avatar (or default), the message content within a Card, and the timestamp.
 *
 * @remarks
 * - Uses `react-markdown` to render the message text, allowing for Markdown formatting.
 * - The avatar is displayed on the left for assistant messages and on the right for user messages.
 * - Provides default styling for user and assistant messages which can be overridden by the `messageStyles` prop.
 * - The timestamp is formatted to display the hour and minute.
 *
 * @example
 * ```tsx
 * import type { Message } from '@/types/message';
 *
 * const sampleMessage: Message = {
 * id: '1',
 * sender: 'user',
 * text: 'Hello, how are you?',
 * timestamp: new Date().toISOString(),
 * };
 *
 * const assistantMessage: Message = {
 * id: '2',
 * sender: 'assistant',
 * text: '**I am doing well, thank you!** How can I help you today?',
 * timestamp: new Date().toISOString(),
 * };
 *
 * <ChatMessage message={sampleMessage} />
 * <ChatMessage message={assistantMessage} renderAvatar={(sender) => sender === 'assistant' ? <img src="/assistant-avatar.png" alt="Assistant" className="h-8 w-8 rounded-full" /> : null} />
 * ```
 */
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
