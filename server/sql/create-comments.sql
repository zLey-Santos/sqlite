drop table if exists comments;
	create table comments (
		id integer primary key autoincrement,
		message text not null,
		created_at timestamp default current_timestemp,
		post_id integer not null,
		foreign key (post_id) references posts(id) on delete cascade
	);

  -- Comandos para manipulação da tabela de comentários(comments)
  
  -- cria um novo comentário em uma publicação
  	insert into comments( message, post_id ) 
		values (' uma nova mensagem 4 2 ', 291) ;

    -- seleciona tudo pelo id 
    select  count(*) 
	  from comments 
	  where post_id = 307;

		--delete uma publicação 
		delete from posts where id = 307;