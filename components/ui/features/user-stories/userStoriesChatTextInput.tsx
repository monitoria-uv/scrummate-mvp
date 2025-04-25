'use client';

import { ChatTextInput } from '@/components/ui/features/chatTextInput';

/**
 * A specialized text input component for the User Stories assistant chat, pre-configured with specific styling and labels.
 *
 * @component
 * @param {{ value: string, onChange: (value: string) => void, onSend: () => void, loading?: boolean }} props - The props for the component.
 * @param {string} props.value - The current text value in the input.
 * @param {(value: string) => void} props.onChange - Callback function triggered when the input value changes.
 * @param {() => void} props.onSend - Callback function triggered when the send action is initiated.
 * @param {boolean} [props.loading=false] - Indicates if the sending process is currently in progress, disabling the input.
 * @returns {JSX.Element} - Renders a `ChatTextInput` component with specific placeholder, styling, and button label for the User Stories assistant.
 *
 * @remarks
 * - This component is a wrapper around the generic `ChatTextInput`, providing a tailored appearance and prompt for the User Stories assistant interaction.
 * - It passes through the `value`, `onChange`, `onSend`, and `loading` props directly to the underlying `ChatTextInput`.
 * - The placeholder text is set to "Describe o pide ayuda sobre historias de usuario...".
 * - Custom Tailwind CSS classes are applied to the textarea and button for branding.
 * - The button label is set to "Redactar".
 *
 * @example
 * ```tsx
 * <UserStoriesChatTextInput
 *   value={inputValue}
 *   onChange={(text) => setInputValue(text)}
 *   onSend={handleSend}
 *   loading={isLoading}
 * />
 * ```
 */
export const UserStoriesChatTextInput = ({
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
      placeholder="Describe o pide ayuda sobre historias de usuario..."
      textareaClassName="bg-yellow-50 border-yellow-300 focus-visible:ring-yellow-500"
      buttonClassName="bg-yellow-600 hover:bg-yellow-700 text-white"
    />
  );
};
