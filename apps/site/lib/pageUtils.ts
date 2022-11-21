import { ManifestVersion, S3Archive } from "@destiny-definitions/common";

interface HashAndVersion {
  hash?: string;
  version?: ManifestVersion;
}

export async function getHashAndVersion(
  s3Client: S3Archive,
  hashAndVersion: string[]
): Promise<HashAndVersion> {
  let hash: string;
  let version: ManifestVersion | undefined;

  const versionHistory = await s3Client.getVersionHistory();

  if (hashAndVersion.length === 1) {
    hash = hashAndVersion[0];
    version = versionHistory.at(-1);
  } else if (hashAndVersion.length === 2) {
    hash = hashAndVersion[1];
    version = versionHistory.find((v) => v.id === hashAndVersion[0]);
  } else {
    return {};
  }

  if (!version) {
    return {};
  }

  return { hash, version };
}
