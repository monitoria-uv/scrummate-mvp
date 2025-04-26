'use client';

import { ChatTextInput } from '@/components/ui/features/chatTextInput';

/**
 * A component that provides a text input for interacting with the meeting assistant.
 *
 * @component
 * @param {Object} props - The properties for the component.
 * @param {string} props.value - The current value of the text input.
 * @param {(value: string) => void} props.onChange - Callback function triggered when the input value changes.
 * @param {() => void} props.onSend - Callback function triggered when the send button is clicked.
 * @param {boolean} [props.loading] - Optional flag indicating if the input is in a loading state.
 * @returns {JSX.Element} - Renders the `ChatTextInput` component with customized styles and placeholder text.
 *
 * @remarks
 * - This component is specifically styled and configured for the meeting assistant functionality.
 * - It uses the `ChatTextInput` component as its base, with additional properties for customization.
 *
 * @example
 * ```tsx
 * <MeetAssistantChatTextInput
 *   value={message}
 *   onChange={setMessage}
 *   onSend={handleSend}
 *   loading={isLoading}
 * />
 * ```
 */
export const MeetAssistantChatTextInput = ({
  value,
  onChange,
  onSend,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading?: boolean;
}) => {
  return (
    <ChatTextInput
      value={value}
      onChange={onChange}
      onSend={onSend}
      loading={loading}
      placeholder="Habla con tu asistente de reuniones/ceremonias Scrum..."
      textareaClassName="bg-blue-50 border-blue-300 focus-visible:ring-blue-500"
      buttonClassName="bg-blue-600 hover:bg-blue-700 text-white"
    />
  );
};
