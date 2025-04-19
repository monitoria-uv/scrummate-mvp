'use client';

import { ChatWindow } from '@/components/ui/features/chatWindow';
import { getScrumRoleResponse } from '@/utils/gemini';
import { addMessage, getMessagesByChatId, getOrCreateDefaultChat } from '@/db/db';
import { Message } from '@/types/message';
import { useState, useCallback } from 'react';
import { ScrumAssistantChatTextInput } from '@/components/ui/features/scrum-assistant/scrumAssistantChatTextInput';
import { ScrumAssistantChatMessage } from '@/components/ui/features/scrum-assistant/scrumAssistantChatMessage';

export function ScrumAssistantChatWindow({ chatId }: { chatId: string }) {
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
        console.error('Error al generar respuesta del asistente Scrum:', error);
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
