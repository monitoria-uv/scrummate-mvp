import { useCallback, useState } from 'react';
import { ChatWindow } from '@/components/ui/features/chatWindow';
import { GoodPracticesChatTextInput } from '@/components/ui/features/good-practices/goodPracticesChatTextInput';
import { addMessage, getMessagesByChatId } from '@/db/db';
import type { Message } from '@/types/message';
import { getGoodPracticesResponse } from '@/utils/gemini';
import { GoodPracticesChatMessage } from '@/components/ui/features/good-practices/goodPracticesChatMessage';

/**
 * A module that integrates the chat window and input for the Good Practices assistant functionality.
 *
 * @component
 * @param {Readonly<{ chatId: string }>} props - The props object containing the `chatId` for the chat session.
 * @returns {JSX.Element} - Renders the `ChatWindow` and `GoodPracticesChatTextInput` components.
 *
 * @remarks
 * - This module serves as a container to assemble the chat interface for interacting with the Good Practices assistant.
 * - It directly renders the chat window and input components, enabling users to send messages and receive responses.
 * - The `ChatWindow` fetches messages dynamically using the provided `chatId`.
 *
 * @example
 * ```tsx
 * <GoodPracticesChatWindow chatId="good-practices-chat" />
 * ```
 */
export function GoodPracticesChatWindow({ chatId }: Readonly<{ chatId: string }>) {
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
        const responseText = await getGoodPracticesResponse(userMessage.text);
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
        console.error('Error al generar respuesta del asistente de buenas prácticas Scrum:', error);
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
        emptyLabel="📢 Escribe algo para empezar tu conversación con el asistente de buenas prácticas Scrum."
        loadingLabel="Escribiendo respuesta..."
        renderMessage={(message) => <GoodPracticesChatMessage key={message.id} message={message} />}
      />
      <GoodPracticesChatTextInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        loading={loading}
      />
    </>
  );
}
