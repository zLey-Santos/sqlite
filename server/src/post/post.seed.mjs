import * as postService from "./post.service.mjs";
import { faker } from "@faker-js/faker";

const defaultLimit = 10;

async function postSeed() {
  const limit = Number(process.argv[2]) || defaultLimit;
  console.log("Iniciando seeding...");
  console.log(`Vão ser criados ${limit} posts`);
  for (let index = 0; index < limit; index++) {
    const postDate = generetePost();

    const post = await postService.createPost(postDate);
    console.log(`Criado post de id #${post.id}`);
  }
  console.log("Seeding realizado com sucesso!");
}

function generetePost() {
  return {
    content: faker.lorem.paragraph(5 + Math.round(Math.random() * 5)),
    createdAt: faker.date.past({ years: 3 }).toJSON(),
  };
}

postSeed();
