'use client';

import { ChatTextInput } from '@/components/ui/features/chatTextInput';
/**
 * A specialized text input component for the Scrum assistant chat, pre-configured with specific styling and labels.
 *
 * @component
 * @param {{ value: string, onChange: (value: string) => void, onSend: () => void, loading?: boolean }} props - The props for the component.
 * @param {string} props.value - The current text value in the input.
 * @param {(value: string) => void} props.onChange - Callback function triggered when the input value changes.
 * @param {() => void} props.onSend - Callback function triggered when the send action is initiated.
 * @param {boolean} [props.loading=false] - Indicates if the sending process is currently in progress, disabling the input.
 * @returns {JSX.Element} - Renders a `ChatTextInput` component with specific placeholder, styling, and button label for the Scrum assistant.
 *
 * @remarks
 * - This component is a wrapper around the generic `ChatTextInput`, providing a tailored appearance and prompt for the Scrum assistant interaction.
 * - It passes through the `value`, `onChange`, `onSend`, and `loading` props directly to the underlying `ChatTextInput`.
 * - The placeholder text is set to "Habla con tu asistente Scrum...".
 * - Custom Tailwind CSS classes are applied to the textarea and button for branding.
 * - The button label is set to "Scrum!".
 *
 * @example
 * ```tsx
 * <ScrumAssistantChatTextInput
 * value={inputValue}
 * onChange={(text) => setInputValue(text)}
 * onSend={handleScrumSend}
 * loading={isScrumLoading}
 * />
 * ```
 */
export const ScrumAssistantChatTextInput = ({
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
      placeholder="Habla con tu asistente Scrum..."
      textareaClassName="bg-blue-50 border-blue-300 focus-visible:ring-blue-500"
      buttonClassName="bg-blue-600 hover:bg-blue-700 text-white"
    />
  );
};
