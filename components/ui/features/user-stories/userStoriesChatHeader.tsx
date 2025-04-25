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
 * A specialized header for the User Stories assistant chat, displaying the title and providing access to a help guide.
 *
 * @component
 * @returns {JSX.Element} - Renders a `ChatHeader` with the User Stories assistant title, icon, and a help dialog trigger.
 *
 * @remarks
 * - Uses the `ChatHeader` component for the main header structure.
 * - Includes a `Dialog` component to display a help guide with example prompts and contextual tips for writing user stories.
 * - The dialog's open state is managed internally using the `useState` hook.
 * - The help trigger button uses a `QuestionMarkCircledIcon` for visual indication.
 *
 * @example
 * ```tsx
 * <UserStoriesChatHeader />
 * ```
 */
export function UserStoriesChatHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatHeader
        title="Asistente de Historias de Usuario"
        icon={<ChatBubbleIcon className="h-6 w-6" />}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Manual de ayuda de Historias de Usuario"
            >
              <QuestionMarkCircledIcon className="h-5 w-5 text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Guía del Asistente de Historias de Usuario
              </DialogTitle>
              <p className="text-sm text-gray mt-1">
                Preguntas clave para escribir buenas historias
              </p>
            </DialogHeader>
            <div className="space-y-6 py-2">
              <section className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-green-50">
                    <h4 className="font-medium">Para comenzar una historia</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      "¿Cómo redactar una historia de usuario efectiva con el formato: Como [rol]
                      quiero [objetivo] para [beneficio]?"
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg bg-green-50">
                    <h4 className="font-medium">Para mejorar historias existentes</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      "¿Cómo refinar esta historia para que sea más clara y testable?"
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </DialogContent>
        </Dialog>
      </ChatHeader>
    </>
  );
}
