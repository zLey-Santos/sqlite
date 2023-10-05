drop table if exists posts;
create table posts (
  id integer primary key autoincrement,
  content text not null,
  created_at timestamp default current_timestamp,
  user_id integer not null references users(id) on delete cascade
  starRating integer default 0, -- Adicionando a coluna starRating
  totalRating integer default 0,
  numberOfRatings integer default 0,
  averageRating real default 0.0
);