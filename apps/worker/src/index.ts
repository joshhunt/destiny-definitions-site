import bungieManifestJob from "./jobs/bungieManifest";
import historicalArchives from "./jobs/historicalArchives";
import { setTimeout } from "timers/promises";
import duration from "parse-duration";
import { WORKER_INTERVAL } from "./env";

async function main() {
  const LOOP_INTERVAL = duration(WORKER_INTERVAL);

  await historicalArchives();

  const keepAlive = process.argv.includes("--keep-alive");

  while (true) {
    await bungieManifestJob();

    if (keepAlive) {
      await setTimeout(LOOP_INTERVAL);
    } else {
      break;
    }
  }
}

main().catch(console.error);
