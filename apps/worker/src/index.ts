import bungieManifestJob from "./jobs/bungieManifest";
import historicalArchives from "./jobs/historicalArchives";
import { setTimeout } from "timers/promises";
import duration from "parse-duration";
import { WORKER_INTERVAL } from "./env";
import log from "lib/log";

async function main() {
  const keepAlive = process.argv.includes("--keep-alive");
  const loopInterval = duration(WORKER_INTERVAL);
  log.info({ keepAlive, loopInterval }, "Worker starting");

  await historicalArchives();

  while (true) {
    await bungieManifestJob();

    if (keepAlive) {
      await setTimeout(loopInterval);
    } else {
      break;
    }
  }
}

main().catch((err) => log.error(err, "Uncaught exception in main()"));

const originalEmit = process.emit;
// @ts-expect-error - TS complains about the return type of originalEmit.apply
process.emit = function (name, data: any, ...args) {
  if (
    name === `warning` &&
    typeof data === `object` &&
    data?.name === `ExperimentalWarning` &&
    data?.message.includes(`Fetch API`)
  )
    return false;

  return originalEmit.apply(
    process,
    arguments as unknown as Parameters<typeof process.emit>
  );
};
