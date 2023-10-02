import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-simple-toasts';
import { useZorm } from 'react-zorm';
import { Helmet } from 'react-helmet';
import { Title } from '../components/Title';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { PostSchema } from '../postSchema ';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { api } from '../api';
import { Textarea } from '../components/TextArea';

const texts = {
  title: 'Editar publicação',
  contentPlaceholder: 'Edite a sua publicação',
  submit: 'Enviar',
  submitSuccess: 'Sua publicação foi editada com sucesso!',
  submitFailure: 'Houve um erro ao editar a sua publicação. :(',
};

export function EditPostRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [initialFormState, setInitialFormState] = useState({
    content: '', // Inicialize com o valor vazio
  });

  const zo = useZorm('edit-post', PostSchema, {
    async onValidSubmit(event) {
      try {
        event.preventDefault();
        const response = await api.put(`/posts/${params.id}`, event.data);
        
        if (response.data.id) {
          toast(texts.submitSuccess);
          navigate(`/view-post/${params.id}`);
        } else {
          toast(texts.submitFailure);
        }
      } catch (error) {
        console.error('Erro ao editar a postagem:', error);
        toast(texts.submitFailure);
      }
    },
  });

  async function loadPost() {
    try {
      const response = await api.get(`/posts/${params.id}`);
      setInitialFormState(response.data);
    } catch (error) {
      console.error('Erro ao carregar a postagem:', error);
      // Lide com o erro, exiba uma mensagem ao usuário, etc.
    }
  }

  useEffect(() => {
    loadPost();
  }, [params.id]);

  return (
    <Card>
      <Helmet>
        <title>Editar publicação #{params.id}</title>
      </Helmet>
      <Breadcrumbs
        links={[
          { href: '/', label: 'Home' },
          {
            href: `/view-post/${params.id}`,
            label: `Ver publicação #${params.id}`,
          },
          {
            label: `Editar publicação #${params.id}`,
          },
        ]}
      />
      <Title className='mb-4 text-center'>
        {texts.title} #{params.id}
      </Title>

      <form ref={zo.ref} className='flex flex-col gap-3'>
        <div>
          <Textarea
            className='rounded-lg p-2 border mt-6 focus:border-amber-300 outline-none w-full resize-none'
            placeholder={texts.contentPlaceholder}
            name={zo.fields.content()}
            value={initialFormState.content} // Use o valor do estado para preencher o campo
            onChange={(e) => {
              // Atualize o estado quando o usuário digitar
              setInitialFormState({
                ...initialFormState,
                content: e.target.value,
              });
            } }
            rows={3} defaultValue={undefined}          />
          {zo.errors.content((error) => (
            <ErrorMessage>{error.message}</ErrorMessage>
          ))}
        </div>
        <div className='flex justify-end items-center px-2'>
          <Button type='submit' className='bg-yellow-500 hover:bg-yellow-600'>
            {texts.submit}
          </Button>
        </div>
      </form>
    </Card>
  );
}
