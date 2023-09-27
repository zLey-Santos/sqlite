import { useState, useEffect, SetStateAction } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { Card } from "../components/Card";
import { Pagination } from "../components/pagination"; // Importe o componente de paginação
import { api } from "../api";
import { IPost, IResponseGetPost } from "../interfaces/IPost";
import { Helmet } from "react-helmet";

const initialPosts = {
  count: 0,
  posts: [],
};
const initialLoading = true;
const pageSize = 10; 

export function HomeRoute() {
  const params = useParams();
  const offset = (parseInt(params.page) - 1) * pageSize;
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(initialLoading);

  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const pageCount = Math.ceil(posts.count / pageSize);

  const location = useLocation();

  async function fetchPosts() {
    const response = await api.get<IResponseGetPost>(
      `/posts?limit=${pageSize}&offset=${offset}`
    );
    const fetchedPosts = response.data;
    setPosts(fetchedPosts);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Função para dividir posts em páginas de tamanho fixo
  function paginate(array: IPost[], pageSize: number, pageNumber: number) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  // Obtenha os posts para a página atual
  const currentPosts = paginate(posts.posts, pageSize, currentPage);

  return (
    <Card>
      <Helmet>
        <title>Home | Orkut</title>
      </Helmet>

      {loading && (
        <div className="flex justify-center">
          <FaSpinner className="text-4xl animate-spin" />
        </div>
      )}

      {currentPosts.map((post) => (
        <Link
          to={`/view-post/${post.id}`}
          key={post.id}
          className="border-b py-2 cursor-pointer block">
          <div className="text-gray-500 mb-2">#{post.id}</div>

          <span className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </span>

          <p>{post.content}</p>
        </Link>
      ))}

      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        basePath="/posts"
        onPageChange={(page: SetStateAction<number>) => setCurrentPage(page)} // Atualiza a página atual
      />
    </Card>
  );
}
