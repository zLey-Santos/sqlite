	drop table if exists posts;
	create table posts ( 
		id integer primary key  autoincrement ,
		content text not null,
		created_at timestamp default current_timestamp
	);