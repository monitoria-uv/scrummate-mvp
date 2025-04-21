export type Message = {
  id: string;
  chat_id: string; // Relacionado con el `chat.id`
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string; // Formato ISO
};
