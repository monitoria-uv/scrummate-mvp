'use client';

import { ChatWindow } from '@/components/ui/features/chatWindow';
import { getUserStoriesResponse } from '@/utils/gemini';
import { addMessage, getMessagesByChatId } from '@/db/db';
import type { Message } from '@/types/message';
import { useState, useCallback } from 'react';
import { UserStoriesChatTextInput } from '@/components/ui/features/user-stories/userStoriesChatTextInput';
import { UserStoriesChatMessage } from '@/components/ui/features/user-stories/userStoriesChatMessage';

/**
 * Provides a chat window specifically for interacting with the User Stories assistant.
 *
 * @component
 * @param {{ chatId: string }} props - The props for the component.
 * @param {string} props.chatId - The unique identifier of the chat session with the User Stories assistant.
 * @returns {JSX.Element} - Renders a `ChatWindow` with input and message rendering tailored to User Stories.
 */
export function UserStoriesChatWindow({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchMessages = useCallback(async (chatId: string) => {
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
      setLoading(true);

      try {
        const responseText = await getUserStoriesResponse(userMessage.text);
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
        console.error('Error al generar respuesta del asistente de historias:', error);
        return [userMessage];
      } finally {
        setLoading(false);
      }
    },
    [chatId],
  );

  const handleSend = async () => {
    if (!input.trim()) return;
    await onSendMessage(input);
    setInput('');
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <ChatWindow
        chatId={chatId}
        fetchMessages={fetchMessages}
        onSendMessage={onSendMessage}
        refreshTrigger={refreshTrigger}
        emptyLabel="📘 Comienza preguntando sobre tus historias de usuario."
        loadingLabel="Redactando sugerencia..."
        renderMessage={(message) => <UserStoriesChatMessage key={message.id} message={message} />}
      />
      <UserStoriesChatTextInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        loading={loading}
      />
    </>
  );
}
