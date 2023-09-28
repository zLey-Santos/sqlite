import { useEffect, useState } from 'react';
import toast from 'react-simple-toasts';
import { api } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
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
import { commentSchema } from '../commentSchema';

const texts = {
  commentsTitle: 'Comentário ',
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
};

export function ViewPostRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<IPost>(initialPostState);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ]);
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        navigate('/not-found-page');
      }
    }

    fetchData();
  }, [id, navigate]);


  async function onCommentSubmit(event) {
    event.preventDefault();

    try {
      const validationResult = commentSchema.safeParse({ message: comment });
      if (validationResult.success) {
        const response = await api.post(`/posts/${id}/comments`, {
          message: comment,
        });

        if (response.data.id) {
          const newComment = {
            id: response.data.id,
            message: comment,
            created_at: response.data.created_at,
          };

          setComments([...comments, newComment]);
          setComment('');
          toast('Comentário adicionado com sucesso!');
        }
      } else {
        const errorMessages = validationResult.error.issues.map((issue) => issue.message);
        errorMessages.forEach((errorMessage) => toast(errorMessage));
      }
    } catch (error) {
      if (error.response === 400 || error.response.data) {
        toast('Erro de validação desconhecido');
      }
    }
  }

  async function handleDeletePost() {
    try {
      const response = await api.delete(`/posts/${id}`);
      if (response.data.id) {
        toast(`A publicação #${post.id} foi deletada com sucesso!`);
        navigate('/');
      } else {
        toast('Houve um erro ao deletar a publicação');
      }
    } catch (error) {
      toast('[ERRO]: Impossível deletar sua publicação');
    }
  }

  async function handleRatePost() {
    try {
      const response = await api.post(`/posts/${id}/rate`, { rating });
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
            { label: `Ver publicação #${id}` },
          ]}
        />
        <div className='flex justify-end gap-3'>
          <Button typeClass='edit' to={`/edit-post/${id}`}>
            <span className='uppercase mr-3 font-bold '>Editar</span>
            <AiOutlineEdit />
          </Button>

          <Button typeClass='danger' onClick={handleDeletePost}>
            <span className='uppercase mr-3 font-bold'>Delete</span>
            <FaTrashAlt />
          </Button>
        </div>

        <div className='text-gray-500 mb-2 '>#{post.id}</div>
        <div className='text-gray-500 '>
          {new Date(post.created_at).toLocaleDateString()}
        </div>
        <Title>{post.title}</Title>

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
          {`Classificação Média: ${post.numberOfRatings > 0
            ? post.averageRating.toFixed(1) + ''
            : 0
            } 
            ( ${post.numberOfRatings} avaliações)`}
        </div>
        <Button
          className='mt-4 bg-sky-500 hover:bg-sky-700'
          typeClass='edit'
          onClick={handleRatePost}>
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
          {comments.slice().reverse().map((comment) => (
            <div
              key={comment.id}
              className='mb-2 py-2  block'>
              <div className='text-gray-500 mb-2'>#{comment.id}</div>
              <span className='text-sm text-gray-500'>
                {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <p className='break-words'>{comment.message}</p>
              <div className='border my-2'></div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
