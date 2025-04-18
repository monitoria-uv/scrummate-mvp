import { FC, KeyboardEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

interface ChatTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading?: boolean;
}

export const ChatTextInput: FC<ChatTextInputProps> = ({ value, onChange, onSend, loading }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() !== '' && !loading) {
        onSend();
      }
    }
  };
  return (
    <form
      className="flex items-end gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() !== '' && !loading) {
          onSend();
        }
      }}
    >
      <Textarea
        ref={textAreaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje y presiona Enter..."
        disabled={loading}
        className="resize-none flex-1 min-h-[44px] max-h-32"
      />
      <Button
        type="submit"
        variant="default"
        className="min-h-[44px] max-h-32"
        disabled={loading || value.trim() === ''}
      >
        <PaperPlaneIcon className="h-4 w-4 mr-1" />
        Enviar
      </Button>
    </form>
  );
};
