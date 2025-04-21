import { ScrumAssistantChatHeader } from '@/components/ui/features/scrum-assistant/scrumAssistantChatHeader';
import { ScrumAssistantChatWindow } from '@/components/ui/features/scrum-assistant/scrumAssistantChatWindow';
import { Footer } from '@/components/ui/features/footer';
/**
 * A module that integrates the header, chat window, and footer for the Scrum assistant functionality.
 *
 * @component
 * @returns {JSX.Element} - Renders the `ScrumAssistantChatHeader`, `ScrumAssistantChatWindow`, and `Footer` components.
 *
 * @remarks
 * - This module serves as a container to assemble the complete user interface for interacting with the Scrum assistant.
 * - It directly renders the specialized header and chat window components for the Scrum assistant, along with a standard footer.
 * - The `ScrumAssistantChatWindow` is initialized with a static `chatId` of "assistant-chat".
 *
 * @example
 * ```tsx
 * <ScrumAssistantModule />
 * ```
 */
export default function ScrumAssistantModule() {
  return (
    <>
      <ScrumAssistantChatHeader />
      <ScrumAssistantChatWindow chatId="assistant-chat" />
      <Footer />
    </>
  );
}
