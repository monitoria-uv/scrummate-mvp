import { ChatHeader } from '@/components/ui/features/chatHeader';
import { ChatBubbleIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
/**
 * A specialized header for the Scrum assistant chat, displaying the title and providing access to a help guide.
 *
 * @component
 * @returns {JSX.Element} - Renders a `ChatHeader` with the Scrum assistant title, icon, and a help dialog trigger.
 *
 * @remarks
 * - Uses the `ChatHeader` component for the main header structure.
 * - Includes a `Dialog` component to display a help guide with example questions and links to other assistants.
 * - The dialog's open state is managed internally using the `useState` hook.
 * - The help trigger button uses a `QuestionMarkCircledIcon` for visual indication.
 *
 * @example
 * ```tsx
 * <ScrumAssistantChatHeader />
 * ```
 */
export function ScrumAssistantChatHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatHeader title="Asistente Scrum" icon={<ChatBubbleIcon className="h-6 w-6" />}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Manual de ayuda"
            >
              <QuestionMarkCircledIcon className="h-5 w-5 text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Guía del Asistente Scrum</DialogTitle>
              <p className="text-sm text-gray mt-1">Preguntas clave para comenzar</p>
            </DialogHeader>
            <div className="space-y-6 py-2">
              <section className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <h4 className="font-medium">Para nuevos en Scrum</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      "¿Cuáles son los 3 pilares y 5 valores de Scrum?"
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <h4 className="font-medium">Para equipos establecidos</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      "¿Cómo mejorar nuestras retrospectivas?"
                    </p>
                  </div>
                </div>
              </section>
              <section className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Otros asistentes disponibles
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Asistente de Reuniones
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Historias de Usuario
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Buenas Prácticas</span>
                </div>
              </section>
            </div>
          </DialogContent>
        </Dialog>
      </ChatHeader>
    </>
  );
}
