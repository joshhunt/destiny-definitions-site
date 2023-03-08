export interface ManifestVersion {
  id: string;
  version: string;
  s3Key: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManifestVersionSummary extends ManifestVersion {
  diffCounts: VersionDiffSummary;
}

export interface DefinitionTableDiff {
  removed: number[];
  added: number[];
  unclassified: number[];
  reclassified: number[];
  modified?: number[];
}

export interface DefinitionTableDiffSummary {
  removed: number;
  added: number;
  unclassified: number;
  reclassified: number;
  modified: number;
}

export interface GroupedDefinitionTableDiff {
  removed: HashGroup;
  added: HashGroup;
  unclassified: HashGroup;
  reclassified: HashGroup;
  modified: HashGroup;
}

export interface VersionDiff {
  [definitionTableName: string]: DefinitionTableDiff;
}

export interface VersionDiffSummary {
  [definitionTableName: string]: DefinitionTableDiffSummary;
}

export type HashGroup = [string, number[]][];
