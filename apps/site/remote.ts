import fs from "fs-extra";
import path from "path";
import { keyBy, mapValues } from "lodash";
import { AllDestinyManifestComponents } from "bungie-api-ts/destiny2";
import { ManifestVersion } from "@destiny-definitions/common";

const CACHE_DIR = path.join(process.cwd(), ".custom-api-cache");

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
    return data;
  } catch {}

  const data = await getData<T>(remoteUrl);

  await fs.writeJSON(localCachePath, data);

  return data;
}

export async function getVersionsIndex() {
  console.warn("Running legacy remote.ts getVersionsIndex");
  const data = await getData<ManifestVersion[]>(
    "https://destiny-definitions.s3-eu-west-1.amazonaws.com/index.json"
  );

  return data;
}

export async function getLatestVersion() {
  console.warn("Running legacy remote.ts getLatestVersion");
  const data = await getVersionsIndex();
  const latest = data?.reduce((a, b) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? a : b
  );
  return latest;
}

export async function getDiffForVersion(id: string) {
  console.warn("Running legacy remote.ts getDiffForVersion", new Error().stack);
  return getData<AllDefinitionDiffs>(
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${id}/diff.json`
  );
}

export async function getModifiedDeepDiff(
  id: string,
  tableName: string
): Promise<ModifiedDeepDiffs | undefined> {
  console.warn("Running legacy remote.ts getModifiedDeepDiff");
  const data = await getData<ModifiedDeepDiffEntry[]>(
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${id}/modifiedDiffs/${tableName}.json`
  );

  if (data) {
    return keyBy(data, (d) => d.hash);
  }

  return data;
}

export async function getVersion(versionId: string) {
  console.warn("Running legacy remote.ts getVersion");
  const index = await getVersionsIndex();
  let found = index?.find((v) => v.id === versionId);
  found = found ?? index?.find((v) => v.id.startsWith(versionId));

  return found;
}

export async function getPreviousVersion(versionId: string) {
  console.warn("Running legacy remote.ts getPreviousVersion");
  const index = await getVersionsIndex();

  const indexOf = index?.findIndex((v) => v.id === versionId) ?? -1;
  const previousVersion = index?.[indexOf - 1];

  return previousVersion;
}

export async function getDiffForTable(
  versionId: string,
  tableName: keyof AllDestinyManifestComponents | string
) {
  console.warn("Running legacy remote.ts getDiffForTable");
  const allDefinitionDiffs = await getDiffForVersion(versionId);
  if (!allDefinitionDiffs) throw new Error("missing diff data for table page");
  return allDefinitionDiffs[tableName];
}

export async function getDefinitionForVersion(
  version: string,
  definitionName: string
) {
  console.warn("Running legacy remote.ts getDefinitionForVersion");
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

export async function getTypedDefinition<
  TableName extends keyof AllDestinyManifestComponents
>(version: string, definitionName: TableName) {
  console.warn("Running legacy remote.ts getTypedDefinition");
  // TODO: type this
  const data = await getCachedData<AllDestinyManifestComponents[TableName]>(
    `${version}__${definitionName}.json`,
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${version}/tables/${definitionName}.json`
  );

  if (!data) {
    throw new Error(`Definitions missing for ${version}/${definitionName}`);
  }

  return data;
}
