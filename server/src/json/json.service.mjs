import { promises as fsp } from "fs";

export async function createjson(path, data) {
  const dataStr = JSON.stringify(data, null, 2);
  await fsp.writeFile(path, dataStr);
}

export async function readjson(path) {
  const dataBuffer = await fsp.readFile(path);
  const dataStr = dataBuffer.toString();
  const data = JSON.parse(dataStr);
  return data;
}

export async function updatejson(path, partialjson) {
  const oldjson = await readjson(path);
  const nextjson = { ...oldjson, ...partialjson };
  await createjson(path, nextjson);
}

export async function deletejson(path) {
  await fsp.unlink(path);
}
