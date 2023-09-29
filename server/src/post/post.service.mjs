import { db } from "../db.mjs";
import { createPostSchema } from "./schemas/create-post.schema.mjs";
import { createPostCommentSchema } from "./schemas/create-post-comment.schema.mjs";

export async function listPosts({ limit, offset, orderBy, search }) {
  const whereSearch = search ? `where content like '%${search}%'` : "";
  const posts = db
    .prepare(
      /* sql */ `
    select
      posts.id,
      posts.content,
      posts.created_at,
      posts.user_id,
      users.first_name as user_first_name,
      users.last_name as user_last_name,
      users.avatar as user_avatar
    from posts join users on posts.user_id = users.id
    ${whereSearch}
    order by posts.created_at ${orderBy} limit ? offset ?`
    )
    .all(limit, offset);

  const { posts_count: count } = db
    .prepare(/* sql */ `select count(id) as posts_count from posts`)
    .get();

  return {
    posts,
    count,
  };
}

export async function createPost(data) {
  await createPostSchema.parseAsync(data);
  const nextPost = db
    .prepare(
      /* sql */ `
      insert into posts (content, user_id) values (?, ?) returning *;`
    )
    .get(data.content, data.user_id);
  return nextPost;
}

export async function readPost(id) {
  const post = db.prepare(/* sql */ `select * from posts where id=?`).get(id);
  return post;
}

export async function updatePost(id, data) {
  const post = db
    .prepare(
      /* sql */ `
      update posts set content=? where id=? returning *;`
    )
    .get(data.content, id);
  return post;
}

export async function deletePost(id) {
  const post = db
    .prepare(/* sql */ `delete from posts where id=? returning *;`)
    .get(id);
  return post;
}

export async function listPostComments(postId) {
  const comments = db
    .prepare(
      /* sql */
      `select
        comments.id,
        comments.message,
        comments.created_at,
        comments.user_id,
        users.first_name as user_first_name,
        users.last_name as user_last_name,
        users.avatar as user_avatar
       from comments join users on comments.user_id = users.id
       where post_id=?
       order by comments.created_at desc`
    )
    .all(postId);

  return comments;
}

export async function createPostComment(postId, data) {
  await createPostCommentSchema.parseAsync(data);
  const comment = db
    .prepare(
      /* sql */ `
    insert into comments (message, post_id, user_id)
    values (?, ?, ?) returning *
  `
    )
    .get(data.message, postId, data.user_id);
  return comment;
}
