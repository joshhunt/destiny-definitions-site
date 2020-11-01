import fs from "fs-extra";
import path from "path";
import {
  ManifestVersion,
  AllDefinitionDiffs,
  AnyDefinitionTable,
  ModifiedDeepDiffEntry,
  ModifiedDeepDiffs,
} from "./types";
import { keyBy, mapValues } from "lodash";

const CACHE_DIR = path.join(".next", "cache", "custom-api-cache");

console.log("CACHE_DIR:", CACHE_DIR);

const getPath = async (name: string, useSharedCache: boolean = false) => {
  let buildId = "dev";

  if (useSharedCache) {
    buildId = "shared";
  } else {
    try {
      buildId = (await fs.readFile(path.join(".next/BUILD_ID"))).toString();
    } catch {}
  }

  await fs.ensureDir(path.join(CACHE_DIR, buildId));

  return path.join(CACHE_DIR, buildId, name);
};

const requestCache: Record<string, Promise<unknown>> = {};

async function getCachedData<T>(
  localCacheFile: string,
  remoteUrl: string,
  useSharedCache: boolean = false
): Promise<T | undefined> {
  async function inner() {
    const localCachePath = await getPath(localCacheFile, useSharedCache);

    try {
      const data = await fs.readJSON(localCachePath);
      console.log("FS CACHED", remoteUrl);
      return data;
    } catch {}

    console.log("FETCHING", remoteUrl);
    const res = await fetch(remoteUrl);
    const data: T | undefined = res.ok ? await res.json() : undefined;

    await fs.writeJSON(localCachePath, data);

    return data;
  }

  if (requestCache[localCacheFile]) {
    console.log("PROMISE CACHED", remoteUrl);
    return requestCache[localCacheFile] as Promise<T | undefined>;
  } else {
    const promise = inner();
    requestCache[localCacheFile] = promise;
    return promise as Promise<T | undefined>;
  }
}

export async function getVersionsIndex(includeTestVersion = false) {
  const data = await getCachedData<ManifestVersion[]>(
    "versions.json",
    "https://destiny-definitions.s3-eu-west-1.amazonaws.com/index.json"
  );

  // if (includeTestVersion && data) {
  //   data.push({
  //     id: "test",
  //     version: "777.77.77.77.777-7",
  //     s3Key: "versions/test/manifest.json",
  //     createdAt: ("2020-07-14T18:38:58.037Z" as unknown) as Date,
  //     updatedAt: ("2020-10-03T14:44:27.390Z" as unknown) as Date,
  //   });
  // }

  return data;
}

export async function getDiffForVersion(id: string) {
  return getCachedData<AllDefinitionDiffs>(
    `${id}__diff.json`,
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${id}/diff.json`,
    true
  );
}

export async function getModifiedDeepDiff(
  id: string,
  tableName: string
): Promise<ModifiedDeepDiffs | undefined> {
  const data = await getCachedData<ModifiedDeepDiffEntry[]>(
    `${id}__modified__${tableName}.json`,
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${id}/modifiedDiffs/${tableName}.json`,
    true
  );

  if (data) {
    return keyBy(data, (d) => d.hash);
  }

  return data;
}

export async function getDefinitionForVersion(
  version: string,
  definitionName: string
) {
  // TODO: type this
  const data = await getCachedData<AnyDefinitionTable>(
    `${version}__${definitionName}.json`,
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${version}/tables/${definitionName}.json`,
    true
  );

  return mapValues(data, (v) => ({
    ...v,
    __type: definitionName,
  })) as AnyDefinitionTable;
}
