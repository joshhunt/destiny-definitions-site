import https from "https";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import mkdirp from "mkdirp";

export async function mkdirpForFile(filePath: string) {
  const folder = path.dirname(filePath);
  await mkdirp(folder);
}

export async function downloadToFile(url: string, filePath: string) {
  const folder = path.dirname(filePath);
  await mkdirp(folder);

  return new Promise((resolve, reject) => {
    const file = createWriteStream(filePath);
    https.get(url, function (response) {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve(file);
      });

      file.on("error", (err) => reject(err));
    });
  });
}

export async function fileExists(path: string) {
  try {
    const stat = await fs.stat(path);
    return !!stat;
  } catch {
    return false;
  }
}
