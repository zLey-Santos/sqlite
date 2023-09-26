import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
import { useZorm } from "react-zorm";
import { Helmet } from "react-helmet";
import { Title } from "../components/Title";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { NotepadSchema } from "../notepadSchema ";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { api } from "../api";

const texts = {
  title: "Editar notepad",
  titlePlaceholder: "Digite o título",
  subtitlePlaceholder: "Digite o subtítulo",
  contentPlaceholder: "Digite o conteúdo",
  submit: "Enviar",
  submitid: "Seu notepad foi editado com sucesso!",
  submitFailure: "Houve um erro ao editar o seu notepad. :(",
};

const initialNotepad = {
  id: 0,
  title: "",
  subtitle: "",
  content: "",
  created_at: "",
};

export function EditNotepadRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [initialFormState, setInitialFormState] = useState(initialNotepad);
  const zo = useZorm("edit-notepad", NotepadSchema, {
    async onValidSubmit(event) {
      event.preventDefault();
      const response = await api.patch(`/notepads/${params.id}`, event.data);
      if (response.data.id) {
        toast(texts.submitid);
        navigate(`/view-notepad/${params.id}`);
      } else {
        toast(texts.submitFailure);
      }
    },
  });

  async function loadNotepad() {
    const response = await api.get(`/notepads/${params.id}`);
    setInitialFormState(response.data);
  }

  useEffect(() => {
    loadNotepad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <Card>
      <Helmet>
        <title>Editar notepad #{params.id}</title>
      </Helmet>
      <Breadcrumbs
        links={[
          { href: "/", label: "Home" },
          {
            href: `/view-notepad/${params.id}`,
            label: `Ver notepad #${params.id}`,
          },
          {
            label: `Editar notepad #${params.id}`,
          },
        ]}
      />
      <Title className="mb-4 text-center">
        {texts.title} #{params.id}
      </Title>

      <form ref={zo.ref} className="flex flex-col gap-3">
        <div>
          <input
            type="text"
            className="rounded-lg px-2 py-1 border focus:border-amber-300 outline-none w-full"
            placeholder={texts.titlePlaceholder}
            name={zo.fields.title()}
            defaultValue={initialFormState.title}
          />

          {zo.errors.title((error) => (
            <ErrorMessage>{error.message}</ErrorMessage>
          ))}
        </div>

        <div>
          <input
            type="text"
            className="rounded-lg px-2 py-1 border focus:border-amber-300 outline-none w-full"
            placeholder={texts.subtitlePlaceholder}
            name={zo.fields.subtitle()}
            defaultValue={initialFormState.subtitle}
          />

          {zo.errors.subtitle((error) => (
            <ErrorMessage>{error.message}</ErrorMessage>
          ))}
        </div>

        <div>
          <textarea
            className="rounded-lg px-2 py-1 border focus:border-amber-300 outline-none w-full resize-none"
            placeholder={texts.contentPlaceholder}
            name={zo.fields.content()}
            defaultValue={initialFormState.content}
          />

          {zo.errors.content((error) => (
            <ErrorMessage>{error.message}</ErrorMessage>
          ))}
        </div>
        <div className=" flex justify-end items-center px-2">
          <Button type="submit" className=" bg-yellow-500 hover:bg-yellow-600">
            Atualizar
          </Button>
        </div>
      </form>
    </Card>
  );
}
