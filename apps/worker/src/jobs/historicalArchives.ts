import path from "path";
import { createWriteStream } from "fs";
import { Readable } from "stream";
import { DEFINITIONS_DIRECTORY, getS3Config, TEMP_DIRECTORY } from "../env";
import { extractContentArchive } from "../lib/dotContent";
import { fileExists, mkdirpForFile } from "../lib/lib";
import { S3Archive } from "@destiny-definitions/common";

export default async function historicalArchives() {
  const s3Config = getS3Config();
  const archiveClient = new S3Archive(s3Config);

  const history = await archiveClient.getVersionHistory();
  history.reverse();
  console.log("\n\nChecking history for", history.length, "versions");

  for (const version of history) {
    const manifest = await archiveClient.getVersionManifest(version.id);
    const enContentPath = manifest.mobileWorldContentPaths["en"];
    if (!enContentPath) {
      throw new Error("no en mobileWorldContentPath for version " + version.id);
    }

    const archiveFileName = path.basename(enContentPath);
    const archiveFilePath = path.join(TEMP_DIRECTORY, archiveFileName);
    const sqlitePath = path.join(DEFINITIONS_DIRECTORY, archiveFileName);

    const sqliteExists = await fileExists(sqlitePath);

    if (sqliteExists) {
      console.log("archive exists " + sqlitePath);
      continue;
    }

    const s3Key = `versions/${version.id}/${archiveFileName}`;

    console.log("Get from S3", s3Key);
    const getCommand = archiveClient.getObjectCommand({
      Bucket: s3Config.bucket,
      Key: s3Key,
    });
    const resp = await archiveClient.s3Client.send(getCommand);

    if (!resp.Body) {
      throw new Error("response has no body");
    }

    if (!(resp.Body instanceof Readable)) {
      throw new Error("Body is not instanceof Readable");
    }

    await pipeBodyToFile(resp.Body, archiveFilePath);

    extractContentArchive(archiveFilePath, sqlitePath);
    console.log(sqlitePath);
  }
}

async function pipeBodyToFile(body: Readable, outputFilePath: string) {
  await mkdirpForFile(outputFilePath);
  return new Promise((resolve, reject) => {
    body.pipe(createWriteStream(outputFilePath));

    body.once("error", (err) => reject(err));
    body.once("end", () => resolve(outputFilePath));
  });
}
