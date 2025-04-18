import { ChatWindow } from '@/components/ui/features/chatWindow';
import { ChatHeader } from '@/components/ui/features/chatHeader';
import { Footer } from '@/components/ui/features/footer';

export default function ScrumAssistantModule() {
  return (
    <>
      <ChatHeader />
      <ChatWindow />
      <Footer />
    </>
  );
}
