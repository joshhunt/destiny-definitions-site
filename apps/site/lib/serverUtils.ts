import {
  ManifestVersion,
  ManifestVersionSummary,
  VersionDiff,
  VersionDiffSummary,
} from "@destiny-definitions/common";
import { mapValues } from "lodash";
import { ParsedUrlQuery } from "querystring";
import duration from "./duration";

export function getVersionSummary(
  version: ManifestVersion,
  versionDiff: VersionDiff
): ManifestVersionSummary {
  const diffSummary = getDiffSummary(versionDiff);
  return {
    ...version,
    diffCounts: diffSummary,
  };
}

export function getDiffSummary(versionDiff: VersionDiff): VersionDiffSummary {
  return mapValues(versionDiff, (tableDiff) => {
    const _tableDiff = { ...tableDiff, modified: tableDiff.modified ?? [] };

    return mapValues(_tableDiff, (hashes) => hashes.length);
  });
}

export function getParamString(
  value: ParsedUrlQuery[string] | undefined
): string | undefined {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function makeMetaProps(baseMeta: Record<string, string | number> = {}) {
  return {
    ...baseMeta,
    buildDate: new Date().toJSON(),
  };
}

export function invalidParamsNotFound() {
  return { notFound: true as const, revalidate: duration("1 week") };
}
