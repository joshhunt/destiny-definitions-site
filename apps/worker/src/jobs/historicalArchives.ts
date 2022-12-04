import path from "path";
import { createWriteStream } from "fs";
import { Readable } from "stream";
import { DEFINITIONS_DIRECTORY, getS3Config, TEMP_DIRECTORY } from "../env";
import { extractContentArchive } from "../lib/dotContent";
import { fileExists, mkdirpForFile } from "../lib/lib";
import { S3Archive } from "@destiny-definitions/common";
import rootLogger from "../lib/log";

const log = rootLogger.child({ workerJob: "historicalArchives" });

export default async function historicalArchives() {
  log.info("Starting job");
  const s3Config = getS3Config();
  const archiveClient = new S3Archive(s3Config);

  const history = await archiveClient.getVersionHistory();
  history.reverse();
  log.debug({ historyLength: history.length }, "Got version history");

  for (const version of history) {
    const versionLogger = log.child({ versionId: version.id });
    versionLogger.debug("Checking version");

    const manifest = await archiveClient.getVersionManifest(version.id);
    const enContentPath = manifest.mobileWorldContentPaths["en"];
    if (!enContentPath) {
      throw new Error(
        "No English mobileWorldContentPath in archived manifest " + version.id
      );
    }

    const archiveFileName = path.basename(enContentPath);
    const archiveFilePath = path.join(TEMP_DIRECTORY, archiveFileName);
    const sqlitePath = path.join(DEFINITIONS_DIRECTORY, archiveFileName);

    const sqliteExists = await fileExists(sqlitePath);

    if (sqliteExists) {
      versionLogger.info({ sqlitePath }, "Archive exists");
      continue;
    }

    const s3Key = `versions/${version.id}/${archiveFileName}`;
    versionLogger.info({ s3Key }, "Downloading archive from S3");

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
    await extractContentArchive(archiveFilePath, sqlitePath);
    versionLogger.info(
      { sqlitePath },
      "Successfully downloaded archived definitions sqlite"
    );
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
