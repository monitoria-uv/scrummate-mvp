import { MeetAssistantChatHeader } from '@/components/ui/features/meet-assistant/meetAssistantChatHeader';
import { MeetAssistantChatWindow } from '@/components/ui/features/meet-assistant/meetAssistantChatWindow';
import { Footer } from '@/components/ui/features/footer';

/**
 * A module that integrates the header, chat window, and footer for the Meet Assistant functionality.
 *
 * @component
 * @returns {JSX.Element} - Renders the `MeetAssistantChatHeader`, `MeetAssistantChatWindow`, and `Footer` components.
 *
 * @remarks
 * - This module serves as a container to assemble the complete user interface for interacting with the Meet Assistant.
 * - It directly renders the specialized header and chat window components for the Meet Assistant, along with a standard footer.
 * - The `MeetAssistantChatWindow` is initialized with a static `chatId` of "meet-chat".
 *
 * @example
 * ```tsx
 * <MeetAssitantModule />
 * ```
 */
export default function MeetAssitantModule() {
  return (
    <>
      <MeetAssistantChatHeader />
      <MeetAssistantChatWindow chatId={'meet-chat'} />
      <Footer />
    </>
  );
}
