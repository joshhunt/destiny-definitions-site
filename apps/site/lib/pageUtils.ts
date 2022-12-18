import { getLatestVersion, getVersion } from "../remote";
import { ManifestVersion } from "../types";
import duration from "./duration";

interface HashAndVersion {
  hash?: string;
  version?: ManifestVersion;
}

export async function getHashAndVersion(
  hashAndVersion: string[]
): Promise<HashAndVersion> {
  let hash: string;
  let version: ManifestVersion | undefined;

  if (hashAndVersion.length === 1) {
    hash = hashAndVersion[0];
    version = await getLatestVersion();
  } else if (hashAndVersion.length === 2) {
    hash = hashAndVersion[1];
    version = await getVersion(hashAndVersion[0]);
  } else {
    return {};
  }

  if (!version) {
    return {};
  }

  return { hash, version };
}
