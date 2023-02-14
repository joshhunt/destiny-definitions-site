import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: ".env.local" });

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (defaultValue) {
    return value ?? defaultValue;
  }

  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
}

export const BUNGIE_API_KEY = getEnvVar("BUNGIE_API_KEY");
export const LOG_LEVEL = getEnvVar("LOG_LEVEL", "debug");

export function getS3Config() {
  return {
    accessKeyId: getEnvVar("S3_ACCESS_KEY_ID"),
    secretAccessKey: getEnvVar("S3_SECRET_ACCESS_KEY"),
    bucket: getEnvVar("S3_BUCKET"),
    region: getEnvVar("S3_REGION"),
  };
}
