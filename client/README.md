# bc-noite-notepads-react-project

Nome: Wesley Santos

Turma:
Bootcamp Desenvolvedor Web Full Stack | [1T23] Noite
@INFNET-BCLFST00C1-N2-L2

Link do repositório projeto no GitHub: https://github.com/zLey-Santos/Projeto-final-react-bc-noite

Primeiro, importamos os módulos necessários e configuramos o roteador usando o React Router.

Em seguida, definimos as rotas para cada página/componente no aplicativo usando o componente <BrowserRouter> e <Route>.

Cada rota é associada a um componente específico que renderiza o conteúdo desejado.


O componente App.js é o componente raiz do aplicativo e envolve todas as outras rotas/componentes.

O componente AppBar é renderizado no topo do aplicativo e fornece uma barra de navegação com links para a página inicial e para criar um novo notepad.

O componente Footer é renderizado no rodapé do aplicativo.

Quando o usuário acessa a página inicial ("/"), o componente HomeRoute é renderizado.

O HomeRoute faz uma solicitação GET para a API para obter a lista de notepads existentes e renderiza esses notepads usando o componente Card.

O componente Card exibe os detalhes do notepad, como título, descrição e data de criação, e fornece links para visualizar e editar o notepad.

Ao clicar no link para criar um novo notepad, o usuário é redirecionado para a rota "/create-notepad", onde o componente CreateNotepadRoute é renderizado.

O componente CreateNotepadRoute exibe um formulário onde o usuário pode inserir o título e a descrição do notepad e enviar o formulário.

Quando o formulário é enviado, o componente envia uma solicitação POST para a API para criar um novo notepad com as informações fornecidas.

Após a criação bem-sucedida, o usuário é redirecionado para a página inicial ("/") e o novo notepad é exibido na lista.

Ao clicar no link para visualizar ou editar um notepad existente, o usuário é redirecionado para as rotas correspondentes ("/view-notepad/:id" ou "/edit-notepad/:id").

Os componentes ViewNotepadRoute e EditNotepadRoute fazem solicitações GET para a API para obter os detalhes do notepad com o ID fornecido e renderizam esses detalhes em um formato adequado.

No caso do componente EditNotepadRoute, o usuário pode editar o título e a descrição do notepad e enviar as alterações.

Quando o formulário de edição é enviado, o componente envia uma solicitação PATCH para a API para atualizar o notepad com as informações modificadas.

Após a atualização bem-sucedida, o usuário é redirecionado para a página de visualização do notepad atualizado.

O aplicativo também inclui um componente NotFoundPage para lidar com rotas não correspondentes, exibindo uma página de erro 404.
  
  #Algumas das tecnologias e bibliotecas que foram usadas:

React: É uma biblioteca JavaScript para construir interfaces de usuário. É o principal framework usado no código fornecido.

React Router: É uma biblioteca de roteamento para React que permite a criação de rotas e navegação no aplicativo.

Axios: É uma biblioteca para fazer solicitações HTTP no navegador. No código fornecido, o Axios é usado para fazer solicitações à API.
