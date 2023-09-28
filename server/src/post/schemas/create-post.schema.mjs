import { z } from 'zod';

const content = z
  .string()
  .min(16, {
    message: 'O conteudo precisa ter pelo menos 16 caracteres',
  })
  .max(320, {
    message: 'O conteudo precisa ter no máximo 320 caracters',
  });

export const createPostSchema = z.object({
  content,
});
