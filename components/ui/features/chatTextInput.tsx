import type { FC, KeyboardEvent, ReactNode } from 'react';
import React, { useRef, useCallback } from 'react';
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

/**
 * A component that provides a text input area for composing chat messages with a send button.
 *
 * @component
 * @param {string} value - The current text value in the input.
 * @param {(value: string) => void} onChange - Callback function triggered when the input value changes.
 * @param {() => void} onSend - Callback function triggered when the send button is clicked or Enter key is pressed (without Shift).
 * @param {boolean} [loading=false] - Indicates if the sending process is currently in progress, disabling the input and button.
 * @param {string} [placeholder='Escribe tu mensaje y presiona Enter...'] - The placeholder text displayed in the input field when it's empty.
 * @param {string} [textareaClassName=''] - Additional CSS classes to apply to the textarea element.
 * @param {string} [buttonClassName=''] - Additional CSS classes to apply to the send button.
 * @param {string} [wrapperClassName=''] - Additional CSS classes to apply to the main wrapper div.
 * @param {React.ReactNode} [buttonIcon=<PaperPlaneIcon className="h-4 w-4 mr-1" />] - The icon to display within the send button.
 * @param {string} [buttonLabel='Enviar'] - The text label for the send button.
 * @returns {JSX.Element} - Renders a div containing a textarea and a button for sending messages.
 *
 * @remarks
 * - Uses a `ref` to manage the textarea element for potential focus or other DOM manipulations.
 * - Handles the Enter key press (without Shift) to trigger the `onSend` function, preventing default newline behavior.
 * - The send button and textarea are disabled when `loading` is true or when the input `value` is empty after trimming.
 *
 * @example
 * ```tsx
 * <ChatTextInput
 * value={message}
 * onChange={(text) => setMessage(text)}
 * onSend={() => {
 * sendMessage(message);
 * setMessage('');
 * }}
 * loading={isSending}
 * placeholder="Escribe aquí tu mensaje..."
 * />
 * ```
 */
export const ChatTextInput = React.memo(function ChatTextInput({
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
}: ChatTextInputProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Handles the `keydown` event for the text area.
   *
   * This function prevents the default behavior of the Enter key when the Shift key is not pressed.
   * If the input value is not empty and the `loading` state is `false`, it triggers the `onSend` function.
   *
   * @param e - The keyboard event triggered by the text area.
   */

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() !== '' && !loading) {
          onSend();
        }
      }
    },
    [value, loading, onSend],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (value.trim() !== '' && !loading) {
        onSend();
      }
    },
    [value, loading, onSend],
  );

  return (
    <div className={`border-t p-4 bg-white ${wrapperClassName}`}>
      <form className="flex items-end gap-2 w-full" onSubmit={handleSubmit}>
        <Textarea
          ref={textAreaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          className={`resize-none flex-1 min-h-[44px] max-h-32 ${textareaClassName}`}
          aria-label="Escribe tu mensaje"
        />
        <Button
          type="submit"
          variant="default"
          className={`min-h-[44px] max-h-32 ${buttonClassName}`}
          disabled={loading || value.trim() === ''}
          aria-label="Enviar mensaje"
        >
          {buttonIcon}
          {buttonLabel}
        </Button>
      </form>
    </div>
  );
});
