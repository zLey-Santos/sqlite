Projeto Orkut - Migrando para SQLite

Nome: Wesley Santos

Turma:
Bootcamp Desenvolvedor Web Full Stack | [1T23] Noite
@INFNET-BCLFST00C1-N2-L2

Link do repositório projeto no GitHub: https://github.com/zLey-Santos/sqlite

Introdução:
O projeto "Orkut" é uma migração e refatoração de um sistema anterior, com a adição de um banco de dados SQLite. Esta documentação descreve as principais funcionalidades e rotas implementadas no projeto.

Códigos Seeds
O código inclui códigos "seeds" para gerar dados de usuários, amigos e publicações para popular o banco de dados.

Endpoints da API
listPosts
Rota: /
Função: Retorna uma lista de postagens com opções de limite, deslocamento, classificação e pesquisa.
Parâmetros: limit, offset, orderBy, search.
Métodos SQL: Utiliza consultas SQL para selecionar e contar postagens, com suporte a pesquisa e classificação.
Retorno: Retorna um objeto contendo as postagens e o total de postagens encontradas.

createPost
Rota: /
Função: Cria uma nova postagem com base nos dados fornecidos.
Validação de Dados: Realiza o parse e a validação dos dados utilizando um esquema específico.
Usuário Aleatório: Seleciona um usuário aleatório para atribuir à postagem.
Inserção no Banco de Dados: Insere a postagem no banco de dados, associando-a ao ID do usuário aleatório.
Retorno: Retorna a postagem criada.

readPost
Rota: /:id
Função: Lê uma postagem com base no ID fornecido.
Retorno: Retorna a postagem encontrada.

updatePost
Rota: /:id
Função: Atualiza uma postagem existente com base no ID fornecido e nos dados fornecidos.
Retorno: Retorna a postagem atualizada.

deletePost
Rota: /:id
Função: Exclui uma postagem com base no ID fornecido.
Retorno: Retorna a postagem excluída.

listPostComments
Rota: /:id/comments
Função: Retorna uma lista de comentários para uma postagem específica.
Retorno: Retorna os comentários associados à postagem.

createPostComment
Rota: /:id/comments
Função: Cria um novo comentário para uma postagem específica com base nos dados fornecidos.
Usuário Aleatório: Seleciona um usuário aleatório para atribuir ao comentário.

Inserção no Banco de Dados: Insere o comentário no banco de dados, associando-o ao ID do usuário aleatório.
Retorno: Retorna o comentário criado.

Controladores
Controlador de Postagens
Definição de Rotas: Define rotas e manipuladores para operações CRUD em postagens.
Validação de Entrada: Utiliza esquemas de validação express-validator para garantir a integridade dos dados de entrada.

Respostas HTTP: Responde com códigos de status HTTP apropriados e dados JSON.
Controlador de Usuários
Definição de Rotas: Define rotas e manipuladores para operações relacionadas a usuários, como leitura de usuário e listagem de amigos.

Respostas HTTP: Responde com dados JSON e códigos de status HTTP apropriados.
Essa documentação abrange as funcionalidades essenciais do projeto Orkut, incluindo as operações CRUD em postagens, criação de comentários, manipulação de usuários e amizades, bem como os códigos seeds para a inicialização do banco de dados SQLite.