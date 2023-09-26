import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Title } from "../components/Title";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
//import { LinkButton } from "../components/LinkButton";
import { Card } from "../components/Card";
import { Pagination } from "../components/pagination"; // Importe o componente de paginação
import { api } from "../api";

const pageSize = 10;

const initialNotepadsList = {
  count: 0,
  notepads: [],
};

export function NotepadPageRoute() {
  const params = useParams();
  const offset = (parseInt(params.page) - 1) * pageSize;
  const [notepadsList, setNotepadsList] = useState(initialNotepadsList);
  const pageCount = Math.ceil(notepadsList.count / pageSize);

  async function loadNotepads() {
    const response = await api.get(
      `/notepads?limit=${pageSize}&offset=${offset}`
    );
    const nextNotepads = response.data;
    setNotepadsList(nextNotepads);
  }

  useEffect(() => {
    loadNotepads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page]);

  return (
    <Card>
      <Helmet>
        <title>Pagina {params.page} | Notepads</title>
      </Helmet>
      <Title>
        Página {params.page} de {pageCount}
      </Title>
      {notepadsList.notepads.map((notepad) => {
        return (
          <Link
            to={`/view-notepad/${notepad.id}`}
            key={notepad.id}
            className="border-b py-2 cursor-pointer block">
            <div className="text-gray-500 mb-2">#{notepad.id}</div>
            <span className="text-sm text-gray-500">
              {new Date(notepad.created_at).toLocaleDateString()}
            </span>
            <h2 className="text-lg font-bold leading-tight pb-1">
              {notepad.title}
            </h2>
            <p>{notepad.subtitle}</p>
          </Link>
        );
      })}
      <Pagination
        pageCount={pageCount}
        currentPage={parseInt(params.page)}
        basePath="/notepads"
        onPageChange={undefined}
      />
    </Card>
  );
}
