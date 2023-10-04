import { useState, useEffect, SetStateAction } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { Card } from '../components/Card';
import { Pagination } from '../components/pagination'; // Importe o componente de paginação
import { api } from '../api';
import { IPost, IResponseGetPost } from '../interfaces/IPost';
import { Helmet } from 'react-helmet';

const initialPosts = {
  count: 0,
  posts: [],
};
const initialLoading = true;
const initialSearch = "";
const initialOrderBy = "desc"
const pageSize = 10;



export function HomeRoute() {
  const params = useParams();
  const [postsList, setPostsList] = useState(initialPosts);
  const [search, setSearch] = useState(initialSearch);
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const offset = (parseInt(params.page) - 1) * pageSize;
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(initialLoading);

  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const pageCount = Math.ceil(posts.count / pageSize);

  async function loadPosts() {
    const response = await api.get(`/posts`, {
      params: {
        search,
        order_by: orderBy,
      },
    });
    const nextPosts = response.data;
    setPostsList(nextPosts);
  }

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
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ search, orderBy]);

  useEffect(() => {
    if (postsList.posts.length > 0) {
      setLoading(false);
    }
  }, [postsList]);

  // Função para dividir posts em páginas de tamanho fixo
  function paginate(array: IPost[], pageSize: number, pageNumber: number) {
    
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }
  paginate(posts.posts, pageSize, currentPage);

  return (
    <Card>
      <Helmet> <title>Orkut | Pub's. Recentes</title>  </Helmet>

      {loading && (
        <div className='flex justify-center'>
          <FaSpinner className='text-4xl animate-spin' />
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="search"
          placeholder="Buscar publicações..."
          className="flex-1 border-gray-400 focus:border-pink-600 rounded-2xl border-2 outline-none p-2"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="bg-white p-2 border-gray-400 focus:border-pink-600 rounded-md border-2"
          onChange={(event) => {
            setOrderBy(event.target.value);
          }}
        >
          <option value="desc">Mais recentes</option>
          <option value="asc">Mais antigas</option>
        </select>
      </div>

      {postsList.posts.length === 0 &&
        loading === false &&
        "Nenhum resultado encontrado"}

{postsList.posts.map((post) => {
        return (
          <div key={post.id} className="border-b py-2">
            <div className="flex items-center gap-2">
              <Link to={`/perfil/${post.user_id}`}>
                <img
                  src={post.user_avatar}
                  alt={`Foto de ${post.user_first_name} ${post.user_last_name}`}
                  className="w-[48px] h-[48px] rounded-full"
                />
              </Link>
              <div className="flex flex-col">
                <Link
                  to={`/perfil/${post.user_id}`}
                  className="text-sky-600 hover:text-sky-800 hover:underline font-bold"
                >
                  {post.user_first_name} {post.user_last_name}
                </Link>
                <span className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Link
              to={`/view-post/${post.id}`}
              className="cursor-pointer block"
            >
              <p>{post.content}</p>
            </Link>
          </div>
        );
      })}

      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        basePath='/posts'
        onPageChange={(page: SetStateAction<number>) => setCurrentPage(page)} // Atualiza a página atual
      />
    </Card>
  );
}
