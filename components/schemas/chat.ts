const { z } = require('zod');
/**
 * Defines the Zod schema and a default object structure for chat messages.
 * @component
 * @remarks This module provides a schema for validating chat message objects
 * and a default chat object with initial values. The timestamps are automatically
 * generated based on the current date.
 * @example
 * ```typescript
 * import { chatSchema, defaultChat } from './chat-utils';
 *
 * const validChat = { role: 'user', created_at: '2024-07-20', updated_at: '2024-07-20' };
 * const invalidChat = { role: 123, created_at: new Date(), updated_at: 'today' };
 *
 * console.log(chatSchema.safeParse(validChat).success); // Output: true
 * console.log(chatSchema.safeParse(invalidChat).success); // Output: false
 * console.log(defaultChat);
 * // Output: { id: 1679000000000, role: '', created_at: '2024-07-20', updated_at: '2024-07-20' } (approximate)
 * ```
 */
export const chatSchema = z.object({
  role: z.string(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
});

export const defaultChat = {
  id: Date.now(),
  role: '',
  created_at: new Date().toISOString().split('T')[0],
  updated_at: new Date().toISOString().split('T')[0],
};
