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
 * A module that provides the header and dialog interface for the Good Practices Scrum assistant.
 *
 * @component
 * @returns {JSX.Element} - Renders the `GoodPracticesChatHeader` component with a dialog for guidance.
 *
 * @remarks
 * - This module serves as the header for the Good Practices Scrum assistant, including a help dialog.
 * - The dialog contains key questions and additional resources for Scrum practices.
 * - It uses the `ChatHeader` component as the main container and integrates Radix UI's `Dialog` for modal functionality.
 *
 * @example
 * ```tsx
 * <GoodPracticesChatHeader />
 * ```
 */
export function GoodPracticesChatHeader() {
  const [open, setOpen] = useState(false);

  return (
    <ChatHeader
      title="Asistente de Buenas Prácticas Scrum"
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
              Guía del Asistente de Buenas Prácticas Scrum
            </DialogTitle>
            <p className="text-sm text-gray mt-1">Preguntas clave para comenzar</p>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <section className="space-y-3">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-medium">Para nuevos en Scrum</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    "¿Cuáles son algunas buenas prácticas para hacer una Daily Scrum efectiva?"
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-medium">Para equipos establecidos</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    "¿Qué buenas prácticas pueden ayudar a un equipo Scrum maduro a seguir mejorando
                    continuamente?"
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
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Ceremonias de Scrum</span>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </ChatHeader>
  );
}
