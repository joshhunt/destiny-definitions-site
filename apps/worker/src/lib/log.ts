import { LOG_LEVEL } from "../env";
import pino from "pino";

export default pino({
  level: LOG_LEVEL,
  name: "@destiny-definitions/worker",
});
