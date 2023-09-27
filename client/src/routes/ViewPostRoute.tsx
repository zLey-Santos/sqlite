import { useEffect, useState } from "react";
import toast from "react-simple-toasts";
import { api } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Title } from "../components/Title";
import { Button } from "../components/Button";
import { IPost } from "../interfaces/IPost";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Helmet } from "react-helmet";
import StarRatings from "react-star-ratings"; // Importe o componente de classificação por estrelas

const initialPostState: IPost = {
  id: 0,
  content: "",
  created_at: "",
  count: 0,
  initialPosts: "",
  starRating: 0,
  totalRating: 0,
  numberOfRatings: 0,
  averageRating: 0,
};

export function ViewPostRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<IPost>(initialPostState);
  const [rating, setRating] = useState(0); // Estado para controlar a classificação

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await api.get(`/posts/${id}`);
        const fetchedPost = response.data;
        setPost(fetchedPost);
      } catch (error) {
        navigate("/not-found-page");
      }
    }

    fetchPost();
  }, [id, navigate]);

  async function handleDeletePost() {
    try {
      const response = await api.delete(`/posts/${id}`);
      if (response.data.id) {
        toast(`A publicação #${post.id} foi deletado com sucesso!`);
        navigate("/");
      } else {
        toast("Houve um erro ao deletar a publicação");
      }
    } catch (error) {
      toast("[ERRO]: Impossivel deletar sua publicação");
    }
  }

  async function handleRatePost() {
    try {
      const response = await api.post(`/posts/${id}/rate`, { rating });
      if (response.data.id) {
        toast(
          `Você classificou o post #${post.id} com ${rating} estrelas!`
        );
        const updatedPost = response.data;
        // Atualize starRating, totalRating e numberOfRatings
        setPost(updatedPost);
      } else {
        toast("Houve um erro ao classificar o post");
      }
    } catch (error) {
      toast("[ERRO]: Impossível classificar o post");
    }
  }

  return (
    <Card>
      <Helmet>
        <title>{post.post}</title>
      </Helmet>
      <Breadcrumbs
        links={[
          { href: "/", label: "Home" },
          {
            label: `Ver publicação #${id}`,
          },
        ]}
      />
      <div className="flex justify-end gap-3">
        <Button typeClass="edit" to={`/edit-post/${id}`}>
          <span className="uppercase mr-3 font-bold">Editar</span>
          <AiOutlineEdit />
        </Button>

        <Button typeClass="danger" onClick={handleDeletePost}>
          <span className="uppercase mr-3 font-bold">Delete</span>
          <FaTrashAlt />
        </Button>
      </div>
      <div className="text-gray-500 mb-2 ">#{post.id}</div>
      <div className="text-gray-500">
        {new Date(post.created_at).toLocaleDateString()}
      </div>
      <Title>{post.title}</Title>
      <p className="mb-4 text-gray-500">{post.subtitle}</p>
      <p>{post.content}</p>

      <div className="border mt-6 mb-6"></div>
      {/* Componente de classificação por estrelas */}
      <div className="flex items-center ">
        <StarRatings
          rating={rating}
          starRatedColor="gold"
          starHoverColor="gold"
          changeRating={setRating} // Manipulador de evento para atualizar a classificação
          numberOfStars={5}
          name="rating"
          starDimension="32px"
        />
        <span className="ml-4">{post.starRating} estrelas</span>
      </div>
      <div className="text-gray-500 mt-2">
        {`Classificação Média:
         ${
           post.numberOfRatings > 0
             ? post.averageRating.toFixed(1) + ""
             : 0
         } (${post.numberOfRatings} avaliações)`}
      </div>
      {/* Botão para enviar a classificação */}
      <Button className="mt-4" typeClass="default" onClick={handleRatePost}>
        Classificar
      </Button>
    </Card>
  );
}
