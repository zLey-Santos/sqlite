import express from 'express';
import * as postService from './post.service.mjs';
import { createPostSchema } from './schemas/create-post.schema.mjs';
import { updatePostSchema } from './schemas/update-post.schema.mjs';
import { createPostCommentSchema } from './schemas/create-post-comment.schema.mjs';
import { validationResult } from 'express-validator';

import { userController } from '../user/user.controller.mjs';
import { db } from '../db.mjs';

export const postController = express.Router();

postController.get('/', async (req, res) => {
  const limit = Number(req.query.limit) || 30;
  const offset = Number(req.query.offset) || 0;
  const orderBy = req.query.order_by || 'desc';
  const search = req.query.search || null;
  const posts = await postService.listPosts({ limit, offset, orderBy, search });
  res.status(200).json(posts);
});

postController.get('/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await postService.readPost(postId);
  res.status(200).json(post);
});

postController.post('/', async (req, res) => {
  const postData = req.body;
  await createPostSchema.parseAsync(postData);
  const post = await postService.createPost(postData);
  res.status(201).json(post);
});

postController.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await postService.deletePost(postId);
  res.status(200).json(post);
});

postController.put('/:id', async (req, res) => {
  const postData = req.body;
  await updatePostSchema.parseAsync(postData);
  const postId = req.params.id;
  const post = await postService.updatePost(postId, postData);
  res.status(200).json(post);
});

postController.get('/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const comments = await postService.listPostComments(postId);
  res.status(200).json(comments);
});

// Controlador para criar um comentário em um post com o ID especificado.
postController.post('/:id/comments', async (req, res) => {
  try {
    // Obtém a mensagem do corpo da solicitação.
    const message = req.body;
    // Obtém o ID do post a partir dos parâmetros da URL.
    const post_id = req.params.id;
    // Chama o serviço para criar um comentário no post especificado.
    const comment = await postService.createPostComment(message, post_id);
    // Responde com um status 201 (Created) e retorna o comentário criado.
    res.status(201).json(comment);
  } catch (error) {
    // Em caso de erro durante o processo, trata o erro e responde com um status de erro.
    console.error("Erro ao criar o comentário:", error);
    res.status(500).json({ error: "Erro ao criar o comentário" });
  }
});



