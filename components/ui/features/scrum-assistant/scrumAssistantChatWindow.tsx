'use client';

import { ChatWindow } from '@/components/ui/features/chatWindow';
import { getScrumRoleResponse } from '@/utils/gemini';
import { addMessage, getMessagesByChatId } from '@/db/db';
import type { Message } from '@/types/message';
import { useState, useCallback } from 'react';
import { ScrumAssistantChatTextInput } from '@/components/ui/features/scrum-assistant/scrumAssistantChatTextInput';
import { ScrumAssistantChatMessage } from '@/components/ui/features/scrum-assistant/scrumAssistantChatMessage';
/**
 * Provides a chat window specifically for interacting with a Scrum assistant, handling message fetching, sending, and display.
 *
 * @component
 * @param {{ chatId: string }} props - The props for the component.
 * @param {string} props.chatId - The unique identifier of the chat session with the Scrum assistant.
 * @returns {JSX.Element} - Renders a `ChatWindow` for displaying messages and a `ScrumAssistantChatTextInput` for user input.
 *
 * @remarks
 * - Manages the state for user input, loading status, and a trigger for refreshing messages.
 * - Uses `useCallback` to memoize the `fetchMessages` and `onSendMessage` functions, optimizing performance.
 * - `fetchMessages` retrieves messages for the given `chatId` from the database.
 * - `onSendMessage` sends the user's message, gets a response from the Scrum assistant via `getScrumRoleResponse`, and adds both messages to the database.
 * - The `refreshTrigger` state is incremented after sending a message to force a re-fetch of messages in the `ChatWindow`.
 * - Renders messages using the `ScrumAssistantChatMessage` component.
 *
 * @example
 * ```tsx
 * <ScrumAssistantChatWindow chatId="some-unique-chat-id" />
 * ```
 */
export function ScrumAssistantChatWindow({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Fetches messages for a specific chat from the database.
   *
   * @param {string} chatId - The unique identifier of the chat.
   * @returns {Promise<Message[]>} - A promise that resolves to an array of messages for the given chat ID.
   */
  const fetchMessages = useCallback(async (chatId: string) => {
    return getMessagesByChatId(chatId);
  }, []);

  /**
   * Sends a user message and retrieves a response from the Scrum assistant, adding both to the database.
   *
   * @param {string} input - The text content of the user's message.
   * @returns {Promise<Message[]>} - A promise that resolves to an array containing the user's message and the assistant's response (if successful).
   */
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
        const responseText = await getScrumRoleResponse(userMessage.text);
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
        console.error('Error al generar respuesta:', error);
        return [userMessage];
      } finally {
        setLoading(false);
      }
    },
    [chatId],
  );
  /**
   * Handles the process of sending a user's message. It checks if the input is not empty,
   * sets the loading state, sends the message via `onSendMessage`, clears the input,
   * triggers a message refresh, and resets the loading state.
   *
   * @returns {Promise<void>} - A promise that resolves when the message sending and processing are complete.
   */
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
        emptyLabel="🧠 Escribe algo para empezar tu conversación con el asistente Scrum."
        loadingLabel="Escribiendo respuesta..."
        renderMessage={(message) => (
          <ScrumAssistantChatMessage key={message.id} message={message} />
        )}
      />
      <ScrumAssistantChatTextInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        loading={loading}
      />
    </>
  );
}
