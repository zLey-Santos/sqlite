import { z } from "zod";

const message = z
  .string()
  .min(4, {
    message: "O mensagem precisa ter pelo menos 4 caracteres",
  })
  .max(96, {
    message: "O mensagem precisa ter no máximo 96 caracters",
  });

export const commentSchema = z.object({
  message,
});
