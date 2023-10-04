import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useZorm } from 'react-zorm';
import toast from 'react-simple-toasts';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { api } from '../api';
import { PostSchema } from '../postSchema ';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Card } from '../components/Card';
import { Helmet } from 'react-helmet';
import {Textarea} from '../components/TextArea'; // Importe o componente Textarea

export function CreatePostRoute() {
  const navigate = useNavigate();
  const zo = useZorm('create-post', PostSchema, {
    async onValidSubmit(event) {
      try {
        event.preventDefault();
        const response = await api.post('/posts', event.data);
        if (response.data.id) {
          toast('Sua publicação foi criada com sucesso!');
          navigate('/');
        } else {
          toast('Houve um erro ao criar a sua publicação. :(');
        }
      } catch (error) {
        console.error('Ocorreu um erro ao criar sua publicação:', error);
        toast('Ocorreu um erro ao criar a sua publicação. ;(');
      }
    },
  });

  const getClassNameInput = (fieldName: string): string => {
    if (zo.errors[fieldName]()) {
      return 'border-red-500 focus:border-red-900';
    }
    return 'focus:border-sky-500';
  };

  const [content, setContent] = useState(''); // Estado para controlar o conteúdo do textarea

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
        ref={zo.ref}
        className='flex flex-col gap-2 m-2 md:max-w-screen-md md:mx-auto'>
        <h1 className='text-center font-bold text-2xl'>Criar publicação</h1>
        
        <div className='flex flex-col'>
          <Textarea
            placeholder='Digite sua publicação'
            rows={3}
            name={zo.fields.content()}
            className={`rounded-lg p-2  border focus:border-sky-500 outline-none resize-none w-full
            ${getClassNameInput('content')}`}
            value={content}
            onChange={(e) => setContent(e.target.value)} // Atualize o estado com o valor do textarea
            defaultValue={undefined}/>

          {zo.errors.content((error) => (
            <ErrorMessage>{error.message}</ErrorMessage>
          ))}
        </div>

        <Button type='submit'>Criar publicação</Button>
      </form>
    </Card>
  );
}
