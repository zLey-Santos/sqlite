import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-simple-toasts';
import { Helmet } from 'react-helmet';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { api } from '../api';
import { Textarea } from '../components/TextArea';
import { PostSchema } from '../postSchema.ts';

const texts = {
  title: 'Editar publicação',
  contentPlaceholder: 'Edite a sua publicação',
  submit: 'Enviar',
  submitSuccess: 'Sua publicação foi editada com sucesso!',
  submitFailure: 'Houve um erro ao editar a sua publicação.',
};

export function EditPostRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
  });

  useEffect(() => {
    // Carrega os dados da postagem quando o componente é montado
    async function loadPost() {
      try {
        // Faz uma chamada à API para obter os dados da postagem com o ID fornecido
        const response = await api.get(`/posts/${params.id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Erro ao carregar a postagem:', error);
        // Exibe uma mensagem de erro caso ocorra um erro ao carregar a postagem
        toast(texts.submitFailure);
      }
    }

    loadPost();
  }, [params.id]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Valide o formData com o PostSchema
      const validationResult = PostSchema.safeParse(formData);
  
      if (validationResult.success) {
        // Se a validação for bem-sucedida, envie os dados atualizados da postagem para a API
        const response = await api.put(`/posts/${params.id}`, formData);
  
        if (response.data.id) {
          // Exibe uma mensagem de sucesso e redireciona para a página de visualização da postagem
          toast(texts.submitSuccess);
          navigate(`/view-post/${params.id}`);
        } else {
          // Exibe uma mensagem de erro se a atualização da postagem falhar
          toast(texts.submitFailure);
        }
      } else {
        // Se a validação falhar, exiba as mensagens de erro
        validationResult.error?.issues.forEach((issue) => {
          toast(issue.message);
        });
      }
    } catch (error) {
      console.error('Erro ao editar a postagem:', error);
      // Exibe uma mensagem de erro caso ocorra um erro ao editar a postagem
      toast(texts.submitFailure);
    }
  };

  const handleContentChange = (e) => {
    // Atualiza o estado 'formData' quando o conteúdo do Textarea é alterado
    setFormData({
      ...formData,
      content: e.target.value,
    });
  };

  return ( 
    <Card>
      <Helmet>
        <title>Editar publicação #{params.id}</title>
      </Helmet>
      {/* Renderiza um formulário de edição de postagem */}
      <form onSubmit={handleFormSubmit} className='flex flex-col gap-3'>
        <div>
          <Textarea
            className='rounded-lg p-2 border mt-6 focus:border-amber-300 outline-none w-full resize-none'
            placeholder={texts.contentPlaceholder}
            name="content"
            value={formData.content}
            onChange={handleContentChange}
            rows={3}
            defaultValue={undefined}
          />
          {/* Exibe o Textarea para edição de conteúdo da postagem */}
        </div>
        <div className='flex justify-end items-center px-2'>
          <Button type='submit' className='bg-yellow-500 hover:bg-yellow-600'>
            {texts.submit}
          </Button>
          {/* Renderiza um botão de envio do formulário */}
        </div>
      </form>
    </Card>
  );
}
