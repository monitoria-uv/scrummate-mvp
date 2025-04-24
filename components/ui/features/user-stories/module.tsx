import { UserStoriesChatHeader } from '@/components/ui/features/user-stories/userStoriesChatHeader';
import { UserStoriesChatWindow } from '@/components/ui/features/user-stories/userStoriesChatWindow';
import { Footer } from '@/components/ui/features/footer';
/**
 * A module that integrates the header, chat window, and footer for the User Stories assistant functionality.
 *
 * @component
 * @returns {JSX.Element} - Renders the `UserStoriesChatHeader`, `UserStoriesChatWindow`, and `Footer` components.
 *
 * @remarks
 * - This module serves as a container to assemble the complete user interface for interacting with the User Stories assistant.
 * - It directly renders the specialized header and chat window components for the User Stories assistant, along with a standard footer.
 * - The `UserStoriesChatWindow` is initialized with a static `chatId` of "user-stories-chat".
 *
 * @example
 * ```tsx
 * <UserStoriesModule />
 * ```
 */
export default function UserStoriesModule() {
  return (
    <>
      <UserStoriesChatHeader />
      <UserStoriesChatWindow chatId="user-stories-chat" />
      <Footer />
    </>
  );
}
