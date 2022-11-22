import { getDestinyManifest } from "bungie-api-ts/destiny2";
import { BUNGIE_API_KEY, DEFINITIONS_DIRECTORY, TEMP_DIRECTORY } from "../env";
import path from "path";
import { downloadToFile, fileExists } from "../lib/lib";
import { extractContentArchive } from "../lib/dotContent";
import { createHttpClient } from "@destiny-definitions/common";

const $http = createHttpClient(BUNGIE_API_KEY);

export default async function () {
  console.log("job: bungieManifest");
  const { Response: manifest } = await getDestinyManifest($http);

  const contentPath = manifest.mobileWorldContentPaths["en"];

  if (!contentPath) {
    throw new Error("No english mobileWorldContentPaths");
  }

  const archiveFileName = path.basename(contentPath);
  const sqlitePath = path.join(DEFINITIONS_DIRECTORY, archiveFileName);

  const sqliteExists = await fileExists(sqlitePath);

  if (sqliteExists) {
    console.log("current exists " + sqlitePath);
    return sqlitePath;
  }

  const archiveFilePath = path.join(TEMP_DIRECTORY, archiveFileName);
  const contentArchiveUrl = `https://www.bungie.net${contentPath}`;

  await downloadToFile(contentArchiveUrl, archiveFilePath);

  return extractContentArchive(archiveFilePath, sqlitePath);
}
