import { MeetAssistantChatHeader } from '@/components/ui/features/meet-assistant/meetAssistantChatHeader';
import { MeetAssistantChatWindow } from '@/components/ui/features/meet-assistant/meetAssistantChatWindow';
import { Footer } from '@/components/ui/features/footer';

export default function MeetAssitantModule() {
  return (
    <>
      <MeetAssistantChatHeader />
      <MeetAssistantChatWindow chatId={'meet-chat'} />
      <Footer />
    </>
  );
}
