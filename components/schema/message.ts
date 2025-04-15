import { z } from 'zod';

export const messageSchema = z.object({
  chat_id: z.string(),
  sender: z.enum(['user', 'assistant']),
  text: z.string().min(1),
  timestamp: z.coerce.string(), // en formato ISO
});

export const defaultMessage = {
  chat_id: '',
  sender: 'user',
  text: '',
  timestamp: new Date().toISOString(),
};
