import * as notepadService from "./notepad.service.mjs";
import { faker } from "@faker-js/faker";

const defaultLimit = 5;

async function notepadSeed() {
  const limit = Number(process.argv[2]) || defaultLimit;
  console.log("Iniciando seeding...");
  console.log(`Vão ser criados ${limit} notepads`);
  for (let index = 0; index < limit; index++) {
    const notepadDate = genereteNotepad();

    const notepad = await notepadService.createNotepad(notepadDate);
    console.log(`Criado notepad de id #${notepad.id}`);
  }
  console.log("Seeding realizado com sucesso!");
}

function genereteNotepad() {
  return {
    title: faker.lorem.word(4 + Math.round(Math.random() * 4)),
    subtitle: faker.lorem.word(8 + Math.round(Math.random() * 4)),
    content: faker.lorem.paragraph(1 + Math.round(Math.random() * 2)),
    createdAt: faker.date.past({ years: 3 }).toJSON(),
  };
}

notepadSeed();
