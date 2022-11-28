import {
  DefinitionTableDiff,
  DefinitionTableDiffSummary,
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
  const diffSummary = getVersionDiffSummary(versionDiff);
  return {
    ...version,
    diffCounts: diffSummary,
  };
}

export function getVersionDiffSummary(
  versionDiff: VersionDiff
): VersionDiffSummary {
  return mapValues(versionDiff, (tableDiff) => {
    return getTableDiffSummary(tableDiff);
  });
}

export function getTableDiffSummary(
  tableDiff: DefinitionTableDiff
): DefinitionTableDiffSummary {
  const _tableDiff = { ...tableDiff, modified: tableDiff.modified ?? [] };

  return mapValues(_tableDiff, (hashes) => hashes.length);
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

export function permanentlyNotFound() {
  return { notFound: true as const, revalidate: duration("1 week") };
}

export function temporaryNotFound() {
  return { notFound: true as const, revalidate: duration("10 seconds") };
}

export function isValidDiffType(
  diffType: string
): diffType is keyof DefinitionTableDiff {
  return (
    diffType === "added" ||
    diffType === "removed" ||
    diffType === "unclassified" ||
    diffType === "reclassified" ||
    diffType === "modified"
  );
}
