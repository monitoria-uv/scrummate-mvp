'use client';

import { ChatTextInput } from '@/components/ui/features/chatTextInput';

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
      buttonLabel="Scrum!"
    />
  );
};
