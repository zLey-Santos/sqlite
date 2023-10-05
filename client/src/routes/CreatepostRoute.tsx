import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useZorm } from 'react-zorm';
import toast from 'react-simple-toasts';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { api } from '../api';
import { PostSchema } from '../postSchema.ts';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Card } from '../components/Card';
import { Helmet } from 'react-helmet';
import { Textarea } from '../components/TextArea';
import { DEFAULT_USER_ID } from '../defaltUserId.ts';

export function CreatePostRoute() {
  const navigate = useNavigate();

  // Inicializa o Zorm para gerenciar o formulário com PostSchema
  const zo = useZorm('create-post', PostSchema, {
    async onValidSubmit(event) {
      event.preventDefault();
      console.log('Validando zo');

      try {
        // Envia os dados do formulário para a API
        const response = await api.post('/posts', {...event.data, user_id:DEFAULT_USER_ID });

        // Verifica se a publicação foi criada com sucesso
        if (response.data.id) {
          toast('Sua publicação foi criada com sucesso!');
          // Redireciona para a página inicial após a criação da publicação
          navigate('/');
        } else {
          toast('Houve um erro ao criar a sua publicação. :(');
        }
      } catch (error) {
        console.error('Ocorreu um erro ao criar sua publicação:', error);
        toast('Ocorreu um erro ao criar a sua publicação. :(');
      }
    },
  });

  // Função para obter a classe CSS com base nos erros do Zorm
  const getClassNameInput = (fieldName: string): string => {
    if (zo.errors[fieldName]()) {
      return 'border-red-500 focus:border-red-900';
    }
    return 'focus:border-sky-500';
  };

  // Estado para controlar o conteúdo do textarea
  const [content, setContent] = useState('');

  

  const handleSubmit = event => {
    event.preventDefault();

    try {
      PostSchema.parse({content});
      console.log('é nois')
      // If the data is valid, submit the form
    } catch (error) {
      // If the data is invalid, display an error message
      console.log(error);
    }
  }

  return (
    <Card>
      <Helmet>
        <title>Criar publicação</title>
      </Helmet>
      <Breadcrumbs
        links={[
          { href: '/', label: 'Home' },
          { href: '', label: 'Criar publicação' },
        ]}
      />
      <form
        onSubmit={handleSubmit}
        ref={zo.ref}
        className='flex flex-col gap-2 m-2 md:max-w-screen-md md:mx-auto'
      >
        <h1 className='text-center font-bold text-2xl'>Criar publicação</h1>

        <div className='flex flex-col'>
          <Textarea
            placeholder='Digite sua publicação'
            rows={3}
            name={zo.fields.content()}
            className={`rounded-lg p-2 border focus:border-sky-500 outline-none resize-none w-full
            ${getClassNameInput('content')}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            defaultValue={undefined}
          />

          {/* Exibe mensagens de erro relacionadas ao campo 'content' do Zorm */}
          {zo.errors.content((error) => (
            <ErrorMessage>{error.message}</ErrorMessage>
          ))}
        </div>

        <Button type="submit">Criar publicação</Button>
      </form>
    </Card>
  );
}
