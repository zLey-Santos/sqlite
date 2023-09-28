import { z } from 'zod';

const content = z
  .string()
  .min(8, {
    message: 'A publicação precisa ter pelo menos 8 caracteres',
  })
  .max(270, {
    message: 'A publicação precisa ter no máximo 270 caracters',
  });

export const createPostSchema = z.object({
  content,
});
