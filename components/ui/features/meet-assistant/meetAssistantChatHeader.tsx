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
 * A module that provides the header for the Scrum meeting assistant functionality.
 *
 * @component
 * @returns {JSX.Element} - Renders the `ChatHeader` component with a help dialog.
 *
 * @remarks
 * - This module serves as the header for the Scrum meeting assistant, including a help dialog with guidance for Scrum ceremonies.
 * - It uses the `Dialog` component to display a guide with key questions and additional resources.
 * - The header includes an icon and a button to trigger the help dialog.
 *
 * @example
 * ```tsx
 * <MeetAssistantChatHeader />
 * ```
 */
export function MeetAssistantChatHeader() {
  const [open, setOpen] = useState(false);

  return (
    <ChatHeader
      title="Asistente de reuniones/ceremonias Scrum"
      icon={<ChatBubbleIcon className="h-6 w-6" />}
    >
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
            <DialogTitle className="text-xl">
              Guía del Asistente de reuniones/ceremonias Scrum
            </DialogTitle>
            <p className="text-sm text-gray mt-1">Preguntas clave para comenzar</p>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <section className="space-y-3">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-medium">Para nuevos en Scrum</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    "¿Qué es una Daily Standup y cómo debería prepararme para ella?"
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-medium">Para equipos establecidos</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    "¿Puedes ayudarnos a preparar nuestra próxima retrospectiva?"
                  </p>
                </div>
              </div>
            </section>
            <section className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Otros asistentes disponibles
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Asistente de Scrum</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Historias de Usuario</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Buenas Prácticas</span>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </ChatHeader>
  );
}
