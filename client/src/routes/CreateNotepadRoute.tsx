import { useNavigate } from "react-router-dom";
import { useZorm } from "react-zorm";
import toast from "react-simple-toasts";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { api } from "../api";
import { NotepadSchema } from "../notepadSchema ";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Card } from "../components/Card";
import { Helmet } from "react-helmet";
import {
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from "react";

export function CreateNotepadRoute() {
  const navigate = useNavigate();
  const zo = useZorm("create-notepad", NotepadSchema, {
    async onValidSubmit(event) {
      try {
        event.preventDefault();
        const response = await api.post("/notepads", event.data);
        if (response.data.id) {
          toast("Seu notepad foi criado com sucesso!");
          navigate("/");
        } else {
          toast("Houve um erro ao criar o seu notepad. :(");
        }
      } catch (error) {
        console.error("Ocorreu um erro ao criar o notepad:", error);
        toast("Ocorreu um erro ao criar o notepad. :(");
      }
    },
  });

  const getClassNameInput = (fieldName: string): string => {
    if (zo.errors[fieldName]()) {
      return "border-red-500 focus:border-red-900";
    }
    return "focus:border-sky-500";
  };

  return (
    <Card>
      <Helmet>
        <title>Criar notepad</title>
      </Helmet>
      <Breadcrumbs
        links={[
          { href: "/", label: "Home" },
          { href: "", label: "Criar notepad" },
        ]}
      />
      <form
        ref={zo.ref}
        className="flex flex-col gap-2 m-2 md:max-w-screen-md md:mx-auto">
        <h1 className="text-center font-bold text-2xl">Criar notepad</h1>

        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Digite o título"
            className={`rounded-lg px-2 py-1 border outline-none w-full
            ${getClassNameInput("title")}`}
            name={zo.fields.title()}
          />

          {zo.errors.title(
            (error: {
              message:
                | string
                | number
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<unknown>>
                | ReactFragment
                | ReactPortal;
            }) => (
              <ErrorMessage>{error.message}</ErrorMessage>
            )
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Digite o subtítulo"
            name={zo.fields.subtitle()}
            className={`rounded-lg px-2 py-1 border outline-none w-full
            ${getClassNameInput("subtitle")}`}
          />

          {zo.errors.subtitle((error) => (
            <ErrorMessage>{error.message}</ErrorMessage>
          ))}
        </div>

        <div className="flex flex-col">
          <textarea
            placeholder="Digite o conteúdo"
            rows={3}
            name={zo.fields.content()}
            className={`rounded-lg px-2 py-1 border focus:border-sky-500 outline-none resize-none w-full
            ${getClassNameInput("content")}`}
          />

          {zo.errors.content((error) => (
            <ErrorMessage>{error.message}</ErrorMessage>
          ))}
        </div>

        <Button type="submit">Enviar</Button>
      </form>{" "}
    </Card>
  );
}
