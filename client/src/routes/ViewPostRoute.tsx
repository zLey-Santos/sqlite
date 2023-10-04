import { useEffect, useState } from 'react';
import toast from 'react-simple-toasts';
import { api } from '../api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Title } from '../components/Title';
import { Button } from '../components/Button';
import { IPost } from '../interfaces/IPost';
import { FaTrashAlt } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Helmet } from 'react-helmet';
import StarRatings from 'react-star-ratings';
import { Textarea } from '../components/TextArea';
import { createPostCommentSchema } from '../commentSchema.ts';

const texts = {
  commentsTitle: 'Comentário',
  commentsSendButton: 'Comentar',
  starRatingButton: 'Classificar',
};

const initialPostState: IPost = {
  id: 0,
  content: '',
  created_at: '',
  count: 0,
  initialPosts: '',
  starRating: 0,
  totalRating: 0,
  numberOfRatings: 0,
  averageRating: 0,
  user_id: 0,
};

const initialComments = [];
const initialComment = '';

export function ViewPostRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<IPost>(initialPostState);
  const [comments, setComments] = useState(initialComments);
  const [comment, setComment] = useState(initialComment);
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({
    message: '',
  });

  async function fetchData() {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        api.get(`/posts/${params.id}`),
        api.get(`/posts/${params.id}/comments`),
      ]);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (error) {
      navigate('/not-found-page');
    }
  }

  async function loadComments() {
    const response = await api.get(`/posts/${params.id}/comments`);
    const comments = response.data;
    setComments(comments);
  }


const DEFAULT_USER_ID = 1;


async function createComment() {
  try {
   
    const commentData = {
      message: comment, 
      user_id: DEFAULT_USER_ID, // Define o ID do usuário como o valor padrão.
    };

    // Realiza a validação do commentData com um esquema (schema).
    const validationResult = createPostCommentSchema.safeParse(commentData);

    if (validationResult.success) {
      // Se a validação for bem-sucedida, envia o comentário para a API.
      await api.post(`/posts/${params.id}/comments`, validationResult.data);

      // Após a criação do comentário, carrega os comentários novamente.
      await loadComments();

      // Limpa o campo de texto após a criação do comentário.
      setComment(''); // Defina o campo de texto como uma string vazia.

    } else {
      // Se houver erros de validação, obtenha a mensagem de erro do schema.
      const errorMessage = validationResult.error?.errors[0]?.message;

      // Exibe a mensagem de erro usando um toast.
      if (errorMessage) {
        toast(errorMessage);
      }
    }
  } catch (error) {
    // Em caso de erro durante o processo, exibe o erro na tela para o usuario.
    toast('Erro ao criar o comentário:', error);
  }
}

  async function deletePost() {
    const response = await api.delete(`/posts/${params.id}`);
    if (response.data.id) {
      toast(`A publicação #${post.id} foi deletada com sucesso!`);
      navigate('/');
    } else {
      toast('Houve um erro ao deletar a publicação');
    }
  }

  async function handleRatePost() {
    try {
      const response = await api.post(`/posts/${params.id}/rate`, { rating });
      if (response.data.id) {
        toast(`Você classificou o post #${post.id} com ${rating} estrelas!`);
        setPost(response.data);
      } else {
        toast('Houve um erro ao classificar o post');
      }
    } catch (error) {
      toast('[ERRO]: Impossível classificar o post');
    }
  }

  async function onCommentSubmit(event) {
    event.preventDefault();
    await createComment();
    await loadComments();
  }

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const postTitleId = `Publicação #${post.id}`;

  return (
    <>
      <Card>
        <Helmet>
          <title>{postTitleId}</title>
        </Helmet>
        <Breadcrumbs
          links={[
            { href: '/', label: 'Home' },
            { label: `Ver publicação #${params.id}` },
          ]}
        />

        <div className='flex justify-end gap-3'>
          <Button typeClass='edit' to={`/edit-post/${params.id}`}>
            <span className='uppercase mr-3 font-bold '>Editar</span>
            <AiOutlineEdit />
          </Button>

          <Button typeClass='danger' onClick={deletePost}>
            <span className='uppercase mr-3 font-bold'>Delete</span>
            <FaTrashAlt />
          </Button>
        </div>

        <div className='text-gray-500 mb-2 '>#{post.id}</div>
        <div className='text-gray-500 '>
          {new Date(post.created_at).toLocaleDateString()}
        </div>

        <p className={'break-words'}>{post.content}</p>

        <div className='border mt-6 mb-6 '></div>
        <div className='flex items-center '>
          <StarRatings
            rating={rating}
            starRatedColor='gold'
            starHoverColor='gold'
            changeRating={setRating}
            numberOfStars={5}
            name='rating'
            starDimension='32px'
          />
          <span className='ml-4'>{post.starRating} estrelas</span>
        </div>
        <div className='text-gray-500 mt-2'>
          {`Classificação Média: ${post.numberOfRatings > 0 ? post.averageRating.toFixed(1) + '' : 0
            } 
            ( ${post.numberOfRatings} avaliações)`}
        </div>
        <Button
          className='mt-4 bg-sky-500 hover:bg-sky-700'
          typeClass='edit'
          onClick={handleRatePost}
        >
          {texts.starRatingButton}
        </Button>
      </Card>

      <Card>
        <Title> {texts.commentsTitle} </Title>

        <form onSubmit={onCommentSubmit} className='mt-3'>
          <Textarea
            className={`rounded-lg p-2  border focus:border-sky-500 outline-none resize-none w-full`}
            value={comment}
            placeholder='Digite o seu comentário'
            rows={3}
            name={undefined}
            onChange={(event) => setComment(event.target.value)}
            defaultValue={undefined}
          />
          {errors.message && (
            <div className='text-red-500'>{errors.message}</div>
          )}
          <div className='flex justify-end mt-2'>
            <Button
              className='bg-sky-500 mb-2 uppercase mr-3 font-bold hover:bg-sky-700 '
              typeClass='edit'
              type='submit'>

              {texts.commentsSendButton}
            </Button>
          </div>
        </form>

        <div>
          {comments.map((comment) => (
            <div key={comment.id} className='border-b py-2'>
              <div className='flex items-center gap-2'>
                <Link to={`/perfil/${comment.user_id}`}>
                  <img
                    src={comment.user_avatar}
                    alt={`Foto de ${comment.user_first_name} ${comment.user_last_name}`}
                    className='w-[48px] h-[48px] rounded-full'
                  />
                </Link>
                <div className='flex flex-col'>
                  <Link
                    to={`/perfil/${comment.user_id}`}
                    className='text-sky-600 hover:text-sky-800 hover:underline font-bold'
                  >
                    {comment.user_first_name} {comment.user_last_name}
                  </Link>
                  <span className='text-sm text-gray-500'>
                    #{comment.user_id}
                  </span>
                  <span className='text-sm text-gray-500'>
                    {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    h
                  </span>
                 
                </div>
              </div>
              <p>{comment.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

