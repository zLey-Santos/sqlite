import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { Card } from "../components/Card";
import { Pagination } from "../components/pagination"; // Importe o componente de paginação
import { api } from "../api";
import { INotepad, IResponseGetNotepad } from "../interfaces/INotepad";
import { Helmet } from "react-helmet";
//import { LinkButton } from "../components/LinkButton";

const initialNotepads = {
  count: 0,
  notepads: [],
};
const initialLoading = true;
const pageSize = 10; // Defina o número de notepads por página

export function HomeRoute() {
  const params = useParams();
  const offset = (parseInt(params.page) - 1) * pageSize;
  const [notepads, setNotepads] = useState(initialNotepads);
  const [loading, setLoading] = useState(initialLoading);

  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const pageCount = Math.ceil(notepads.count / pageSize);

  const location = useLocation();

  async function fetchNotepads() {
    const response = await api.get<IResponseGetNotepad>(
      `/notepads?limit=${pageSize}&offset=${offset}`
    );
    const fetchedNotepads = response.data;
    setNotepads(fetchedNotepads);
    setLoading(false);
  }

  useEffect(() => {
    fetchNotepads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Função para dividir notepads em páginas de tamanho fixo
  function paginate(array: INotepad[], pageSize: number, pageNumber: number) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  // Obtenha os notepads para a página atual
  const currentNotepads = paginate(notepads.notepads, pageSize, currentPage);

  return (
    <Card>
      <Helmet>
        <title>Home | Notepads</title>
      </Helmet>

      {loading && (
        <div className="flex justify-center">
          <FaSpinner className="text-4xl animate-spin" />
        </div>
      )}

      {currentNotepads.map((notepad) => (
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
      ))}

      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        basePath="/notepads"
        onPageChange={(page) => setCurrentPage(page)} // Atualiza a página atual
      />
    </Card>
  );
}
