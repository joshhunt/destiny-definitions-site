import bungieManifestJob from "./jobs/bungieManifest";
import historicalArchives from "./jobs/historicalArchives";
import { setTimeout } from "timers/promises";
import duration from "parse-duration";
import { WORKER_INTERVAL } from "./env";

async function main() {
  const LOOP_INTERVAL = duration(WORKER_INTERVAL);

  const jobs = [bungieManifestJob, historicalArchives];

  const keepAlive = process.argv.includes("--keep-alive");
  console.log("keepAlive?", keepAlive);

  while (true) {
    const usedBefore = process.memoryUsage() as unknown as Record<
      string,
      number
    >;
    for (let key in usedBefore) {
      console.log(
        `Before: ${key} ${
          Math.round(((usedBefore[key] ?? 0) / 1024 / 1024) * 100) / 100
        } MB`
      );
    }

    for (const job of jobs) {
      await job();
    }

    const usedAfter = process.memoryUsage() as unknown as Record<
      string,
      number
    >;
    for (let key in usedAfter) {
      console.log(
        `After: ${key} ${
          Math.round(((usedAfter[key] ?? 0) / 1024 / 1024) * 100) / 100
        } MB`
      );
    }

    if (keepAlive) {
      await setTimeout(LOOP_INTERVAL);
    } else {
      break;
    }
  }
}

main().catch(console.error);
