import * as dotenv from "dotenv";
import { S3Archive } from "@destiny-definitions/common";
import { setTimeout as sleep } from "timers/promises";
dotenv.config({ path: ".env.local" });

const SLEEP = 30 * 1000;
async function main() {
  const archiveClient = S3Archive.newFromEnvVars();

  const versions = await archiveClient.getVersionHistory();

  // const startingIndex =
  //   versions.findIndex(
  //     (v) => v.id === "4498a160-bf34-466f-ab2f-c81849526feb"
  //   ) ?? 1;

  const startingIndex = 1;

  for (let version of versions.slice(startingIndex - 1)) {
    const versionDiff = await archiveClient.getVersionDiff(version.id);

    for (let tableName in versionDiff) {
      if (tableName.includes("Unlock")) continue;
      if (tableName.includes("Reward")) continue;
      if (tableName.includes("ArtDyeReference")) continue;

      const diff = versionDiff[tableName];

      if (diff.added.length > 10) {
        loadPage(version.id, tableName, "added");
        await sleep(SLEEP);
      }

      if (diff.unclassified.length > 10) {
        loadPage(version.id, tableName, "unclassified");
        await sleep(SLEEP);
      }

      if (diff.removed.length > 10) {
        loadPage(version.id, tableName, "removed");
        await sleep(SLEEP);
      }

      if (diff.reclassified.length > 10) {
        loadPage(version.id, tableName, "reclassified");
        await sleep(SLEEP);
      }

      if ((diff.modified?.length ?? 0) > 100) {
        loadPage(version.id, tableName, "modified");
        await sleep(SLEEP);
      }
    }
  }
}

async function loadPage(version: string, tableName: string, diffType: string) {
  const path = `/version/${version}/${tableName}/${diffType}`;
  console.log("Fetching", path);

  try {
    const resp = await fetch(
      `https://destiny-definitions-archive.fly.dev${path}`
    );

    if (resp.ok) {
      return resp.text();
    } else {
      console.log(path, "return non-ok", resp.status, resp.statusText);
    }
  } catch (err: any) {
    console.log(path, "threw exception", err.message ?? err);
  }
}

main().catch(console.error);
