import { getDestinyManifest } from "bungie-api-ts/destiny2";
import { BUNGIE_API_KEY, DEFINITIONS_DIRECTORY, TEMP_DIRECTORY } from "../env";
import path from "path";
import { downloadToFile, fileExists } from "../lib/lib";
import { extractContentArchive } from "../lib/dotContent";
import { createHttpClient } from "@destiny-definitions/common";
import rootLogger from "../lib/log";

const $http = createHttpClient(BUNGIE_API_KEY);

const workerLogger = rootLogger.child({ workerJob: "bungieManifest" });

export default async function () {
  workerLogger.info("Starting job");

  const { Response: manifest } = await getDestinyManifest($http);
  const log = workerLogger.child({
    bungieManifestVersion: manifest?.version,
  });

  const contentPath = manifest.mobileWorldContentPaths["en"];
  log.info({ contentPath }, "Got manifest");

  if (!contentPath) {
    throw new Error("No English mobileWorldContentPath in current manifest");
  }

  const archiveFileName = path.basename(contentPath);
  const sqlitePath = path.join(DEFINITIONS_DIRECTORY, archiveFileName);

  const sqliteExists = await fileExists(sqlitePath);

  if (sqliteExists) {
    log.debug({ sqlitePath, contentPath }, "Current exists");
    return sqlitePath;
  }

  log.info(
    { sqlitePath, contentPath },
    "Downloading current definitions sqlite"
  );

  const archiveFilePath = path.join(TEMP_DIRECTORY, archiveFileName);
  const contentArchiveUrl = `https://www.bungie.net${contentPath}`;

  await downloadToFile(contentArchiveUrl, archiveFilePath);
  await extractContentArchive(archiveFilePath, sqlitePath);

  log.info(
    { sqlitePath },
    "Successfully downloaded current definitions sqlite"
  );
}
