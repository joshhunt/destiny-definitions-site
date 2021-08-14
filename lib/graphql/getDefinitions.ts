import axios from "axios";
import redis, { ReplyError } from "redis";

const client = redis.createClient();

redis.add_command("JSON.SET");
redis.add_command("JSON.GET");

let defStore: Record<string, Record<string, any>> = {};

const BUNGIE_API_KEY = "21a93b95633f476f88f8ba183edb3c32";

function redisGetDefinition(
  version: string,
  tableName: string,
  hash: string
): Promise<[string | null, string | null]> {
  return new Promise((resolve, reject) => {
    const redisKey = `${version}-${tableName}`;
    const hashKey = `hash_${hash}`;

    client
      .multi([
        ["JSON.GET", redisKey, "version"],
        ["JSON.GET", redisKey, `definitions.${hashKey}`],
      ])
      .exec((err, resp) => {
        if (err) {
          return reject(err);
        }

        const [versionResult, definitionResult] = resp;

        if (definitionResult instanceof ReplyError) {
          console.log(definitionResult.message);
          return resolve([versionResult, null]);
        }

        resolve([versionResult, definitionResult]);
      });
  });
}

function redisSetDefinitions(version: string, tableName: string, data: any) {
  const redisKey = `${version}-${tableName}`;

  return new Promise((resolve, reject) => {
    client
      .multi([["JSON.SET", redisKey, ".", JSON.stringify(data)]])
      .exec((err, resp) => {
        if (err) {
          return reject(err);
        }

        resolve(resp as any);
      });
  });
}

// TODO: this needs to use redis cache and support versions
export async function getDefinition(
  version: string,
  tableName: string,
  hash: string
) {
  const [versionResult, definitionResult] = await redisGetDefinition(
    version,
    tableName,
    hash
  );

  if (definitionResult) {
    return JSON.parse(definitionResult);
  }

  if (versionResult) {
    console.warn(
      `Redis has version ${version}, but no definition for hash ${hash} in ${tableName}`
    );
    return null;
  }

  console.log("Requesting definitions", { version, tableName });
  const { data } = await axios.get(
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${version}/tables/${tableName}.json`
  );

  const definitionsForRedis = Object.fromEntries(
    Object.entries(data).map(([hash, def]) => [`hash_${hash}`, def])
  );

  const forRedis = {
    version,
    definitions: definitionsForRedis,
  };

  await redisSetDefinitions(version, tableName, forRedis);

  return data[hash];
}
