import { z } from 'zod';

const message = z
  .string()
  .min(4, {
    message: 'O mensagem precisa ter pelo menos 4 caracteres',
  })
  .max(120, {
    message: 'O mensagem precisa ter no máximo 120 caracters',
  });

export const createPostCommentSchema = z.object({
  message,
});