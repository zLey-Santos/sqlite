	drop table if exists notepads;
	create table notepads ( 
		id integer primary key  autoincrement ,
		title varchar(255) not null,
		subtitle varchar(255) not null,
		content text not null,
		created_at timestamp default current_timestamp
	);