import { FC, KeyboardEvent, useRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

export interface ChatTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading?: boolean;
  placeholder?: string;
  textareaClassName?: string;
  buttonClassName?: string;
  wrapperClassName?: string;
  buttonIcon?: ReactNode;
  buttonLabel?: string;
}

export const ChatTextInput: FC<ChatTextInputProps> = ({
  value,
  onChange,
  onSend,
  loading,
  placeholder = 'Escribe tu mensaje y presiona Enter...',
  textareaClassName = '',
  buttonClassName = '',
  wrapperClassName = '',
  buttonIcon = <PaperPlaneIcon className="h-4 w-4 mr-1" />,
  buttonLabel = 'Enviar',
}) => {
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
    <div className={`border-t p-4 bg-white ${wrapperClassName}`}>
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
          placeholder={placeholder}
          disabled={loading}
          className={`resize-none flex-1 min-h-[44px] max-h-32 ${textareaClassName}`}
        />
        <Button
          type="submit"
          variant="default"
          className={`min-h-[44px] max-h-32 ${buttonClassName}`}
          disabled={loading || value.trim() === ''}
        >
          {buttonIcon}
          {buttonLabel}
        </Button>
      </form>
    </div>
  );
};
