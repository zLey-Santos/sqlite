import { promises as fsp } from "fs";
import { db } from "../db.mjs";
import * as jsonService from "../json/json.service.mjs";
import { createNotepadSchema } from "./schemas/create-notepad.schema.mjs";
import { updateNotepadSchema } from "./schemas/update-notepad.schema.mjs";

const notepadsPath = "data/notepads";
const notepadLatestIdPath = "data/notepadsLatestId.json";

export async function listNotepads({ limit, offset }) {
  const notepadsFiles = await fsp.readdir(notepadsPath);
  const notepadToLoads = notepadsFiles
    .sort((a, b) => {
      const idA = parseInt(a);
      const idB = parseInt(b);
      return idB - idA;
    })
    .slice(offset, limit + offset);
  const count = notepadsFiles.length;
  let notepads = [];
  for (const notepadFile of notepadToLoads) {
    const currentNotepad = await jsonService.readjson(
      `${notepadsPath}/${notepadFile}`
    );
    notepads.push(currentNotepad);
  }
  return {
    notepads: notepads,
    count,
  };
}

export async function createNotepad(data) {
  await createNotepadSchema.parseAsync(data);
  const { notepadsLatestId } = await jsonService.readjson(notepadLatestIdPath);
  const notepadId = notepadsLatestId + 1;

  const nextNotepad = {
    created_at: new Date().toJSON(),
    id: notepadId,
    starRating: 0, // Adicione a propriedade starRating com valor inicial 0
    numberOfRatings: 0, // Adicione a propriedade numberOfRatings com valor inicial 0
    averageRating: 0, // Adicione a propriedade averageRating com valor inicial 0
    ...data,
  };
  const path = `${notepadsPath}/${nextNotepad.id}.json`;
  await jsonService.createjson(path, nextNotepad);
  await jsonService.updatejson(notepadLatestIdPath, {
    notepadsLatestId: notepadId,
  });
  return nextNotepad;
}

export async function readNotepad(id) {
  const notepad = db
    .prepare(/* sql */ ` select * from notepads where id = ? `)
    .get(id);
  return notepad;
}

export async function updateNotepad(id, data) {
  await updateNotepadSchema.parseAsync(data);
  const path = `${notepadsPath}/${id}.json`;
  await jsonService.updatejson(path, data);
  const notepad = await jsonService.readjson(path);
  return notepad;
}

export async function deleteNotepad(id) {
  const path = `${notepadsPath}/${id}.json`;
  const notepad = await jsonService.readjson(path);
  await jsonService.deletejson(path);
  return notepad;
}

// Função para atualizar a classificação da nota
export async function rateNotepad(id, rating) {
  const notepad = await readNotepad(id);

  // Atualize a pontuação total das estrelas da nota
  notepad.starRating += rating;

  // Atualize o número de classificações
  notepad.numberOfRatings++;

  // Calcule a nova classificação média
  notepad.averageRating = notepad.starRating / notepad.numberOfRatings;

  // Salve a nota atualizada no arquivo JSON
  await jsonService.updatejson(`${notepadsPath}/${id}.json`, notepad);

  return notepad;
}
