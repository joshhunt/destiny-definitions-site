import { createHttpClient, S3Archive } from "@destiny-definitions/common";
import {
  DestinySeasonDefinition,
  getDestinyManifest,
} from "bungie-api-ts/destiny2";
import { BUNGIE_API_KEY, getS3Config } from "env";
import log from "lib/log";
import fs from "fs/promises";

const $http = createHttpClient(BUNGIE_API_KEY);

async function main() {
  log.info("Generating config");

  const s3Config = getS3Config();
  const archiveClient = new S3Archive(s3Config);

  const history = await archiveClient.getVersionHistory();
  history.reverse();
  log.debug({ historyLength: history.length }, "Got version history");

  const { Response: manifest } = await getDestinyManifest($http);
  const seasonDefsUrl =
    manifest.jsonWorldComponentContentPaths.en.DestinySeasonDefinition;

  log.info({ seasonDefsUrl }, "Got season manifest path");

  const seasonDefs: Record<string, DestinySeasonDefinition> = await $http({
    url: `https://www.bungie.net${seasonDefsUrl}`,
    method: "GET",
  });

  const seasons = Object.values(seasonDefs)
    .filter((season) => {
      return season.startDate;
    })
    .map((season) => {
      if (!season.startDate) throw new Error("season needs start date");

      const seasonStartDate = new Date(season.startDate);
      const seasonStartLower = new Date(seasonStartDate);
      seasonStartLower.setHours(seasonStartLower.getHours() - 10);

      const seasonStartUpper = new Date(seasonStartDate);
      seasonStartUpper.setHours(seasonStartUpper.getHours() + 10);

      return {
        seasonStartDate,
        seasonStartLower,
        seasonStartUpper,
        ...season,
      };
    });

  const additionalDataFile = await fs.readFile(
    "../../apps/site/components/Version/additionalData.json"
  );
  const additionalData = JSON.parse(additionalDataFile.toString());
  console.log(additionalData);

  for (const historyVersion of history) {
    const updateDate = new Date(historyVersion.createdAt);

    const matchingSeasons = seasons.filter((season) => {
      return (
        updateDate.getTime() > season.seasonStartLower.getTime() &&
        updateDate.getTime() < season.seasonStartUpper.getTime()
      );
    });

    for (const season of matchingSeasons) {
      log.info(
        {
          version: historyVersion.version,
          seasonName: season.displayProperties.name,
        },
        "Matched version to season"
      );

      if (!additionalData[historyVersion.version]?.subtitle) {
        if (!additionalData[historyVersion.version]) {
          additionalData[historyVersion.version] = {};
        }

        additionalData[historyVersion.version].subtitle =
          season.displayProperties.name;
      }
    }
  }

  await fs.writeFile(
    "../../apps/site/components/Version/additionalData.json",
    JSON.stringify(additionalData, null, 2)
  );
}

main().catch((err) => log.error(err, "Uncaught exception in main()"));
