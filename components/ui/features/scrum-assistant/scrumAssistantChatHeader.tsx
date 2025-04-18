import { ChatHeader } from '@/components/ui/features/chatHeader';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

export function ScrumAssistantChatHeader() {
  return (
    <>
      <ChatHeader title="Asistente Scrum" icon={<ChatBubbleIcon className="h-6 w-6" />} />
    </>
  );
}
