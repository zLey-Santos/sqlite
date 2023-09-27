import express from 'express';
import * as postService from './post.service.mjs';
import { createPostSchema } from './schemas/create-post.schema.mjs';
import { updatePostSchema } from './schemas/update-post.schema.mjs';

export const postController = express.Router();

postController.get('/', async (req, res) => {
  const limit = Number(req.query.limit) || 30;
  const offset = Number(req.query.offset) || 0;
  const posts = await postService.listPosts({ limit, offset });
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
  try {
    const postData = req.body;
    await updatePostSchema.parseAsync(postData);
    const postId = req.params.id;
    const post = await postService.updatePost(postId, postData);
    res.status(200).json(post);
  } catch (error) {
    res.status(422).json(error);
  }
});

// Novo endpoint para classificar uma nota
postController.post('/:id/rate', async (req, res) => {
  const postId = req.params.id;
  const rating = req.body.rating;

  try {
    const post = await postService.ratePost(postId, rating);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao classificar o post' });
  }
});
