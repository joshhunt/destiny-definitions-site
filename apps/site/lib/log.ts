import pino from "pino";

const LOG_LEVEL = process.env.LOG_LEVEL ?? "debug";

export default pino({
  level: LOG_LEVEL,
  name: "@destiny-definitions/site",
});
