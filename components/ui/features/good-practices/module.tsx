import { GoodPracticesChatHeader } from '@/components/ui/features/good-practices/goodPracticesChatHeader';
import { GoodPracticesChatWindow } from '@/components/ui/features/good-practices/goodPracticesChatWindow';
import { Footer } from '@/components/ui/features/footer';

/**
 * A module that integrates the header, chat window, and footer for the Good Practices assistant functionality.
 *
 * @component
 * @returns {JSX.Element} - Renders the `GoodPracticesChatHeader`, `GoodPracticesChatWindow`, and `Footer` components.
 *
 * @remarks
 * - This module serves as a container to assemble the complete user interface for interacting with the Good Practices assistant.
 * - It directly renders the specialized header and chat window components for the Good Practices assistant, along with a standard footer.
 * - The `GoodPracticesChatWindow` is initialized with a static `chatId` of "good-practices-chat".
 *
 * @example
 * ```tsx
 * <GoodPracticesModule />
 * ```
 */
export default function GoodPracticesModule() {
  return (
    <>
      <GoodPracticesChatHeader />
      <GoodPracticesChatWindow chatId={'good-practices-chat'} />
      <Footer />
    </>
  );
}
