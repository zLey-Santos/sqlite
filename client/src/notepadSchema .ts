import { z } from "zod";

const title = z
  .string()
  .min(4, {
    message: "O título precisa ter pelo menos 4 caracteres",
  })
  .max(96, {
    message: "O título precisa ter no máximo 96 caracters",
  });

const subtitle = z
  .string()
  .min(8, {
    message: "O subtítulo precisa ter pelo menos 8 caracteres",
  })
  .max(128, {
    message: "O subtítulo precisa ter no máximo 128 caracters",
  });

const content = z
  .string()
  .min(12, {
    message: "O conteudo precisa ter pelo menos 12 caracteres",
  })
  .max(640, {
    message: "O conteudo precisa ter no máximo 640 caracters",
  });

export const NotepadSchema = z.object({
  title,
  subtitle,
  content,
});
