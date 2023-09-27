# bc-noite-posts-react-project

Nome: Wesley Santos

Turma:
Bootcamp Desenvolvedor Web Full Stack | [1T23] Noite
@INFNET-BCLFST00C1-N2-L2

Link do repositório projeto no GitHub: https://github.com/zLey-Santos/Projeto-final-react-bc-noite

Primeiro, importamos os módulos necessários e configuramos o roteador usando o React Router.

Em seguida, definimos as rotas para cada página/componente no aplicativo usando o componente <BrowserRouter> e <Route>.

Cada rota é associada a um componente específico que renderiza o conteúdo desejado.


O componente App.js é o componente raiz do aplicativo e envolve todas as outras rotas/componentes.

O componente AppBar é renderizado no topo do aplicativo e fornece uma barra de navegação com links para a página inicial e para criar um novo post.

O componente Footer é renderizado no rodapé do aplicativo.

Quando o usuário acessa a página inicial ("/"), o componente HomeRoute é renderizado.

O HomeRoute faz uma solicitação GET para a API para obter a lista de posts existentes e renderiza esses posts usando o componente Card.

O componente Card exibe os detalhes do post, como título, descrição e data de criação, e fornece links para visualizar e editar o post.

Ao clicar no link para criar um novo post, o usuário é redirecionado para a rota "/create-post", onde o componente CreatePostRoute é renderizado.

O componente CreatePostRoute exibe um formulário onde o usuário pode inserir o título e a descrição do post e enviar o formulário.

Quando o formulário é enviado, o componente envia uma solicitação POST para a API para criar um novo post com as informações fornecidas.

Após a criação bem-sucedida, o usuário é redirecionado para a página inicial ("/") e o novo post é exibido na lista.

Ao clicar no link para visualizar ou editar um post existente, o usuário é redirecionado para as rotas correspondentes ("/view-post/:id" ou "/edit-post/:id").

Os componentes ViewPostRoute e EditPostRoute fazem solicitações GET para a API para obter os detalhes do post com o ID fornecido e renderizam esses detalhes em um formato adequado.

No caso do componente EditPostRoute, o usuário pode editar o título e a descrição do post e enviar as alterações.

Quando o formulário de edição é enviado, o componente envia uma solicitação PATCH para a API para atualizar o post com as informações modificadas.

Após a atualização bem-sucedida, o usuário é redirecionado para a página de visualização do post atualizado.

O aplicativo também inclui um componente NotFoundPage para lidar com rotas não correspondentes, exibindo uma página de erro 404.
  
  #Algumas das tecnologias e bibliotecas que foram usadas:

React: É uma biblioteca JavaScript para construir interfaces de usuário. É o principal framework usado no código fornecido.

React Router: É uma biblioteca de roteamento para React que permite a criação de rotas e navegação no aplicativo.

Axios: É uma biblioteca para fazer solicitações HTTP no navegador. No código fornecido, o Axios é usado para fazer solicitações à API.
