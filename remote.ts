import fs from "fs-extra";
import path from "path";
import {
  ManifestVersion,
  AllDefinitionDiffs,
  AnyDefinitionTable,
} from "./types";
import { mapValues } from "lodash";

const CACHE_DIR = ".api-cache";

const getPath = async (name: string) => {
  let buildId = "dev";

  try {
    buildId = (await fs.readFile(path.join(".next/BUILD_ID"))).toString();
  } catch {}

  await fs.ensureDir(path.join(CACHE_DIR, buildId));

  return path.join(CACHE_DIR, buildId, name);
};

async function getCachedData<T>(
  localCacheFile: string,
  remoteUrl: string
): Promise<T | null> {
  const localCachePath = await getPath(localCacheFile);

  try {
    const data = await fs.readJSON(localCachePath);
    console.log("CACHED", remoteUrl);
    return data;
  } catch {}

  console.log("FETCHED", localCachePath);
  const res = await fetch(remoteUrl);
  const data: T | null = res.ok ? await res.json() : null;
  await fs.writeJSON(localCachePath, data);

  return data;
}

export async function getVersionsIndex() {
  return getCachedData<ManifestVersion[]>(
    "versions.json",
    "https://destiny-definitions.s3-eu-west-1.amazonaws.com/index.json"
  );
}

export async function getDiffForVersion(version: string) {
  return getCachedData<AllDefinitionDiffs>(
    `${version}__diff.json`,
    `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${version}/diff.json`
  );
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

  return mapValues(data, (v) => ({
    ...v,
    __type: definitionName,
  })) as AnyDefinitionTable;
}
