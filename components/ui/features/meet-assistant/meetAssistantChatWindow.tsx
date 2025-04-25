import { useCallback, useState } from 'react';
import { ChatWindow } from '@/components/ui/features/chatWindow';
import { MeetAssistantChatTextInput } from '@/components/ui/features/meet-assistant/meetAssistantChatTextInput';
import { addMessage, getMessagesByChatId } from '@/db/db';
import type { Message } from '@/types/message';
import { getScrumCeremonyResponse } from '@/utils/gemini';
import { MeetAssistantChatMessage } from '@/components/ui/features/meet-assistant/meetAssistantChatMessage';

/**
 * A module that integrates the chat window and input for the Scrum meeting assistant functionality.
 *
 * @component
 * @param {Readonly<{ chatId: string }>} props - The props object containing the `chatId` for the chat session.
 * @returns {JSX.Element} - Renders the `ChatWindow` and `MeetAssistantChatTextInput` components.
 *
 * @remarks
 * - This module serves as a container to assemble the chat interface for interacting with the Scrum meeting assistant.
 * - It fetches messages, handles user input, and generates responses from the assistant.
 * - The `ChatWindow` is dynamically updated based on user input and assistant responses.
 *
 * @example
 * ```tsx
 * <MeetAssistantChatWindow chatId="scrum-meeting-chat" />
 * ```
 */
export function MeetAssistantChatWindow({ chatId }: Readonly<{ chatId: string }>) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchMessages = useCallback(async (chatId: string) => {
    console.log('fetchMessages', chatId);
    return getMessagesByChatId(chatId);
  }, []);

  const onSendMessage = useCallback(
    async (input: string): Promise<Message[]> => {
      const userMessage: Message = {
        id: Date.now().toString(),
        chat_id: chatId,
        sender: 'user',
        text: input.trim(),
        timestamp: new Date().toISOString(),
      };

      await addMessage(userMessage);

      try {
        const responseText = await getScrumCeremonyResponse(userMessage.text);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          chat_id: chatId,
          sender: 'assistant',
          text: responseText,
          timestamp: new Date().toISOString(),
        };

        await addMessage(assistantMessage);
        return [userMessage, assistantMessage];
      } catch (error) {
        console.error(
          'Error al generar respuesta del asistente de reuniones/ceremonias Scrum:',
          error,
        );
        return [userMessage];
      }
    },
    [chatId],
  );

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await onSendMessage(input);
    setInput('');
    setRefreshTrigger((prev) => prev + 1);
    setLoading(false);
  };

  return (
    <>
      <ChatWindow
        chatId={chatId}
        fetchMessages={fetchMessages}
        onSendMessage={onSendMessage}
        refreshTrigger={refreshTrigger}
        emptyLabel="🤝 Escribe algo para empezar tu conversación con el asistente de ceremonias Scrum."
        loadingLabel="Escribiendo respuesta..."
        renderMessage={(message) => <MeetAssistantChatMessage key={message.id} message={message} />}
      />
      <MeetAssistantChatTextInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        loading={loading}
      />
    </>
  );
}
