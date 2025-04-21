import { z } from 'zod';
/**
 * Defines the Zod schema and a default object structure for individual chat messages.
 * @component
 * @remarks This module provides a schema for validating the structure of a single chat message
 * and a default message object with initial values. The `timestamp` is automatically
 * generated in ISO format upon creation of a new default message.
 * @example
 * ```typescript
 * import { messageSchema, defaultMessage } from './message-utils';
 *
 * const validMessage = { chat_id: 'abc-123', sender: 'user', text: 'Hello!', timestamp: '2024-07-20T10:00:00.000Z' };
 * const invalidMessage = { chat_id: 123, sender: 'bot', text: '', timestamp: 'today' };
 *
 * console.log(messageSchema.safeParse(validMessage).success); // Output: true
 * console.log(messageSchema.safeParse(invalidMessage).success); // Output: false
 * console.log(defaultMessage);
 * // Output: { chat_id: '', sender: 'user', text: '', timestamp: '2024-07-20T10:00:00.000Z' } (approximate)
 * ```
 */
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
