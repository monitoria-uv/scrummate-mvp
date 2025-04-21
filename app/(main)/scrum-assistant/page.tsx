'use client';
import ScrumAssistantModule from '@/components/ui/features/scrum-assistant/module';
/**
 * A top-level component that renders the full Scrum assistant feature module within a full-height, scrollable container.
 *
 * @component
 * @returns {JSX.Element} - Renders the `ScrumAssistantModule` wrapped in a `div` with specific layout styles.
 *
 * @remarks
 * - This component sets up the basic layout for the Scrum assistant page, ensuring it occupies the full screen height and allows for vertical scrolling if the content overflows.
 * - It directly renders the `ScrumAssistantModule`, which encapsulates the header, chat window, and footer for the Scrum assistant.
 * - The styling is applied using Tailwind CSS classes.
 *
 * @example
 * ```tsx
 * <ScrumAssistant />
 * ```
 */
export default function ScrumAssistant() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ScrumAssistantModule />
    </div>
  );
}
