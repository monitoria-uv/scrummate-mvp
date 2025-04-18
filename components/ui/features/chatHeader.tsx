'use client';

import { ChatBubbleIcon } from '@radix-ui/react-icons';

export function ChatHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ChatBubbleIcon className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Asistente de Scrum</h1>
      </div>
    </header>
  );
}
