'use client';

import { useEffect, useState } from 'react';
import { ChatMessage } from '@/components/ui/features/chatMessage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types/message';
import { Chat } from '@/types/chat';
import {
  addChat,
  addMessage,
  getMessagesByChatId,
  getAllChats,
  getAllMessages,
  getOrCreateDefaultChat,
} from '@/db/db';

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    async function loadChatAndMessages() {
      const defaultChat = await getOrCreateDefaultChat();
      console.log('🔹 Default chat:', defaultChat.id);
      setChat(defaultChat);

      const msgs = await getMessagesByChatId(defaultChat.id);
      console.log('🔹 Messages:', msgs);
      setMessages(msgs);
    }

    loadChatAndMessages();
  }, []);

  useEffect(() => {
    if (chat?.id) {
      getMessagesByChatId(chat.id).then(setMessages);
    }
    async function logDBContent() {
      const allChats = await getAllChats();
      const allMessages = await getAllMessages();

      console.log('🗂️ Todos los chats en la DB:', allChats);
      console.log('✉️ Todos los mensajes en la DB:', allMessages);
    }

    logDBContent();
  }, [chat]);

  const handleSend = async () => {
    if (!chat?.id) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chat_id: chat.id,
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    await addMessage(newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  if (!chat) {
    return <div className="p-4">Cargando chat...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 space-y-2 max-h-[400px] overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessage key={msg.id.toString()} message={msg} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
          Enviar
        </button>
      </div>
    </div>
  );
}
