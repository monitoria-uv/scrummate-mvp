'use client';

import { useEffect, useState, useRef } from 'react';
import { ChatMessage } from '@/components/ui/features/chatMessage';
import { ChatTextInput } from '@/components/ui/features/chatTextInput';
import { Footer } from '@/components/ui/features/footer';
import { getScrumRoleResponse } from '@/utils/gemini';
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
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendScrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      {
        root: messagesRef.current,
        threshold: 1.0,
      },
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [messagesRef.current, bottomRef.current]);

  useEffect(() => {
    async function loadChatAndMessages() {
      const defaultChat = await getOrCreateDefaultChat();
      setChat(defaultChat);

      const msgs = await getMessagesByChatId(defaultChat.id);
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

  useEffect(() => {
    sendScrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!chat?.id || input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      chat_id: chat.id,
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    await addMessage(userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await getScrumRoleResponse(userMessage.text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        chat_id: chat.id,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toISOString(),
      };

      await addMessage(botMessage);
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al generar respuesta del asistente Scrum:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!chat) {
    return <div className="p-4">Cargando chat...</div>;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.length === 0 && !loading ? (
          <div className="text-center text-gray-500 mt-20">
            🧠 Escribe algo para empezar tu conversación con el asistente Scrum.
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id.toString()} message={msg} />
            ))}
            {loading && <div className="italic text-gray-500">Escribiendo respuesta...</div>}
            <div ref={bottomRef} />
          </>
        )}

        {showScrollButton && (
          <div className="absolute bottom-[150px] right-4 z-20">
            <Button
              onClick={sendScrollToBottom}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 w-12 shadow-lg transition-all duration-200"
              variant="default"
              size="icon"
              aria-label="Ir al final"
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
      <div className="border-t p-4 bg-white">
        <ChatTextInput value={input} onChange={setInput} onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
