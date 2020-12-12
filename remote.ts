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
import { AllDestinyManifestComponents } from "bungie-api-ts/destiny2";

const CACHE_DIR = path.join(process.cwd(), "custom-api-cache");
console.log("CACHE_DIR:", CACHE_DIR);

const getPath = async (name: string) => {
  const cachePrefix = "shared";
  await fs.ensureDir(path.join(CACHE_DIR, cachePrefix));
  return path.join(CACHE_DIR, cachePrefix, name);
};

async function getData<T>(remoteUrl: string): Promise<T | undefined> {
  const res = await fetch(remoteUrl);
  const data: T | undefined = res.ok ? await res.json() : undefined;

  return data;
}

async function getCachedData<T>(
  localCacheFile: string,
  remoteUrl: string
): Promise<T | undefined> {
  const localCachePath = await getPath(localCacheFile);

  try {
    const data = await fs.readJSON(localCachePath);
    console.log("FS CACHED", remoteUrl);
    return data;
  } catch {}

  console.log("FETCHING", remoteUrl);
  const data = await getData<T>(remoteUrl);

  await fs.writeJSON(localCachePath, data);

  return data;
}

export async function getVersionsIndex() {
  const data = await getData<ManifestVersion[]>(
    "https://destiny-definitions.s3-eu-west-1.amazonaws.com/index.json"
  );

  return data;
}

export async function getDiffForVersion(id: string) {
  return getData<AllDefinitionDiffs>(
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${id}/diff.json`
  );
}

export async function getModifiedDeepDiff(
  id: string,
  tableName: string
): Promise<ModifiedDeepDiffs | undefined> {
  const data = await getData<ModifiedDeepDiffEntry[]>(
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${id}/modifiedDiffs/${tableName}.json`
  );

  if (data) {
    return keyBy(data, (d) => d.hash);
  }

  return data;
}

export async function getVersion(versionId: string) {
  const index = await getVersionsIndex();
  const found = index?.find((v) => (v.id = versionId));
  return found;
}

export async function getPreviousVersion(versionId: string) {
  const index = await getVersionsIndex();
  const indexOf = index?.findIndex((v) => (v.id = versionId)) ?? -1;
  const previousVersion = index?.[indexOf - 1];

  return previousVersion;
}

export async function getDiffForTable(
  versionId: string,
  tableName: keyof AllDestinyManifestComponents | string
) {
  const allDefinitionDiffs = await getDiffForVersion(versionId);
  if (!allDefinitionDiffs) throw new Error("missing diff data for table page");
  return allDefinitionDiffs[tableName];
}

export async function getDefinitionForVersion(
  version: string,
  definitionName: string
) {
  // TODO: type this
  const data = await getCachedData<AnyDefinitionTable>(
    `${version}__${definitionName}.json`,
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${version}/tables/${definitionName}.json`
  );

  if (!data) {
    throw new Error(`Definitions missing for ${version}/${definitionName}`);
  }

  return mapValues(data, (v) => ({
    ...v,
    __type: definitionName,
  })) as AnyDefinitionTable;
}
