import * as postService from './post.service.mjs';
import { faker } from '@faker-js/faker';

const defaultLimit = 100;
const minCommentCount = 3;
const commentRange = 12;

async function postSeed() {
  const limit = Number(process.argv[2]) || defaultLimit;
  console.log('Iniciando seeding...');
  console.log(`Vão ser criados ${limit} posts`);
  for (let index = 0; index < limit; index++) {
    const postDate = generetePost();
    const post = await postService.createPost(postDate);
    console.log(`=> Criado post de ID #${post.id} <=`);
    await commentSeed(post);
  }
  console.log('Seeding realizado com sucesso!');
}

function generetePost() {
  return {
    content: faker.lorem.words(3 + Math.round(Math.random() * 3)),
    createdAt: faker.date.past({ years: 3 }).toJSON(),
  }
}


async function commentSeed(post) {
  const commentCount = minCommentCount + Math.round(Math.random() *  commentRange );
  for(let index = 0; index < commentCount; index++){
    const comment = genereteComment();
    const addedComment = await postService.createPostComments(post.id, comment);
    console.log(`Comentário criado com o ID #${addedComment.id}`);
  }
}

function genereteComment() {
  return {
    message: faker.lorem.words(2 + Math.round(Math.random() * 2)),
    createdAt: faker.date.past({ years: 3 }).toJSON(),
  }
}

postSeed();
