import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Pagination } from '../components/pagination'; // Importe o componente de paginação
import { api } from '../api';
import { Helmet } from 'react-helmet';

const pageSize = 10;
const initialPostsList = {
  count: 0,
  posts: [],
};

export function PostPageRoute() {
  const params = useParams();
  const offset = (parseInt(params.page) - 1) * pageSize;
  const [postsList, setPostsList] = useState(initialPostsList);
  const pageCount = Math.ceil(postsList.count / pageSize);

  async function loadPosts() {
    const response = await api.get(`/posts?limit=${pageSize}&offset=${offset}`);
    const nextPosts = response.data;
    setPostsList(nextPosts);
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page]);

  // exibe número ea quantidade de página no helmet da publicação
  const postPage = `Publicação pág. ${params.page} de ${pageCount}`
  return (
    <Card>
      <Helmet><title> {postPage} </title></Helmet> 
      
      {postsList.posts.map((post) => {
        return (
          <Link
            to={`/view-post/${post.id}`}
            key={post.id}
            className='border-b py-2 cursor-pointer block'>
            <div className='text-gray-500 mb-2'>#{post.id}</div>
            <span className='text-sm text-gray-500'>
              {new Date(post.created_at).toLocaleDateString()}
            </span>
            <p>{post.content}</p>
          </Link>
        );
      })}
      <Pagination
        pageCount={pageCount}
        currentPage={parseInt(params.page)}
        basePath='/posts'
        onPageChange={undefined}
      />
    </Card>
  );
}
