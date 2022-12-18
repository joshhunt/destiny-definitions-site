import StreamZip from "node-stream-zip";
import { mkdirpForFile } from "./lib";
import fs from "fs/promises";

export async function extractContentArchive(
  archiveFilePath: string,
  sqliteFilePath: string
) {
  const zip = new StreamZip.async({ file: archiveFilePath });
  const sqliteEntry = Object.values(await zip.entries()).find((v) =>
    v.name.endsWith(".content")
  );

  if (!sqliteEntry) {
    throw new Error("Unable to find .content in zip archive");
  }

  await mkdirpForFile(sqliteFilePath);

  await zip.extract(sqliteEntry, sqliteFilePath);

  await fs.rm(archiveFilePath);

  return sqliteFilePath;
}
