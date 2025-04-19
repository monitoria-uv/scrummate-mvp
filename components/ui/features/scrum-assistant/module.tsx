import { ScrumAssistantChatHeader } from '@/components/ui/features/scrum-assistant/scrumAssistantChatHeader';
import { ScrumAssistantChatWindow } from '@/components/ui/features/scrum-assistant/scrumAssistantChatWindow';
import { Footer } from '@/components/ui/features/footer';

export default function ScrumAssistantModule() {
  return (
    <>
      <ScrumAssistantChatHeader />
      <ScrumAssistantChatWindow chatId="assistant-chat" />
      <Footer />
    </>
  );
}
