import { useEffect, useState } from "react";
import toast from "react-simple-toasts";
import { api } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Title } from "../components/Title";
import { Button } from "../components/Button";
import { INotepad } from "../interfaces/INotepad";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Helmet } from "react-helmet";
import StarRatings from "react-star-ratings"; // Importe o componente de classificação por estrelas

const initialNotepadState: INotepad = {
  id: 0,
  title: "",
  subtitle: "",
  content: "",
  created_at: "",
  count: 0,
  initialNotepads: "",
  starRating: 0,
  totalRating: 0,
  numberOfRatings: 0,
  averageRating: 0,
};

export function ViewNotepadRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notepad, setNotepad] = useState<INotepad>(initialNotepadState);
  const [rating, setRating] = useState(0); // Estado para controlar a classificação

  useEffect(() => {
    async function fetchNotepad() {
      try {
        const response = await api.get(`/notepads/${id}`);
        const fetchedNotepad = response.data;
        setNotepad(fetchedNotepad);
      } catch (error) {
        navigate("/not-found-page");
      }
    }

    fetchNotepad();
  }, [id, navigate]);

  async function handleDeleteNotepad() {
    try {
      const response = await api.delete(`/notepads/${id}`);
      if (response.data.id) {
        toast(`O notepad #${notepad.id} foi deletado com sucesso!`);
        navigate("/");
      } else {
        toast("Houve um erro ao deletar o notepad");
      }
    } catch (error) {
      toast("[ERRO]: Impossivel deletar o notepad");
    }
  }

  async function handleRateNotepad() {
    try {
      const response = await api.post(`/notepads/${id}/rate`, { rating });
      if (response.data.id) {
        toast(
          `Você classificou o notepad #${notepad.id} com ${rating} estrelas!`
        );
        const updatedNotepad = response.data;
        // Atualize starRating, totalRating e numberOfRatings
        setNotepad(updatedNotepad);
      } else {
        toast("Houve um erro ao classificar o notepad");
      }
    } catch (error) {
      toast("[ERRO]: Impossível classificar o notepad");
    }
  }

  return (
    <Card>
      <Helmet>
        <title>{notepad.title}</title>
      </Helmet>
      <Breadcrumbs
        links={[
          { href: "/", label: "Home" },
          {
            label: `Ver notepad #${id}`,
          },
        ]}
      />
      <div className="flex justify-end gap-3">
        <Button typeClass="edit" to={`/edit-notepad/${id}`}>
          <span className="uppercase mr-3 font-bold">Editar</span>
          <AiOutlineEdit />
        </Button>

        <Button typeClass="danger" onClick={handleDeleteNotepad}>
          <span className="uppercase mr-3 font-bold">Delete</span>
          <FaTrashAlt />
        </Button>
      </div>
      <div className="text-gray-500 mb-2 ">#{notepad.id}</div>
      <div className="text-gray-500">
        {new Date(notepad.created_at).toLocaleDateString()}
      </div>
      <Title>{notepad.title}</Title>
      <p className="mb-4 text-gray-500">{notepad.subtitle}</p>
      <p>{notepad.content}</p>

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
        <span className="ml-4">{notepad.starRating} estrelas</span>
      </div>
      <div className="text-gray-500 mt-2">
        {`Classificação Média:
         ${
           notepad.numberOfRatings > 0
             ? notepad.averageRating.toFixed(1) + ""
             : 0
         } (${notepad.numberOfRatings} avaliações)`}
      </div>
      {/* Botão para enviar a classificação */}
      <Button className="mt-4" typeClass="default" onClick={handleRateNotepad}>
        Classificar
      </Button>
    </Card>
  );
}
