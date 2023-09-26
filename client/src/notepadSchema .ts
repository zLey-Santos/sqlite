import { z } from "zod";

const title = z
  .string()
  .min(4, {
    message: "O título precisa ter pelo menos 4 caracteres",
  })
  .max(18, {
    message: "O título precisa ter no máximo 18 caracters",
  });

const subtitle = z
  .string()
  .min(8, {
    message: "O subtítulo precisa ter pelo menos 8 caracteres",
  })
  .max(28, {
    message: "O subtítulo precisa ter no máximo 28 caracters",
  });

const content = z
  .string()
  .min(12, {
    message: "O conteudo precisa ter pelo menos 12 caracteres",
  })
  .max(240, {
    message: "O conteudo precisa ter no máximo 240 caracters",
  });

export const NotepadSchema = z.object({
  title,
  subtitle,
  content,
});
