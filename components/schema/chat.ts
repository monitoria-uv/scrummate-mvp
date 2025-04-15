const { z } = require('zod');

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
