export interface ManifestVersion {
  readonly id: string;
  readonly version: string;
  readonly s3Key: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface DefinitionDiff {
  readonly removed: number[];
  readonly added: number[];
  readonly unclassified: number[];
  readonly reclassified: number[];
  readonly modified?: number[];
}

export interface DefinitionDiffSummary {
  tableName: string;
  removed: number;
  added: number;
  unclassified: number;
  reclassified: number;
  modified: number;
}

export interface DetailedManifestVersion extends ManifestVersion {
  diffSummary: DefinitionDiffSummary[];
}

export type AllDefinitionDiffs = {
  [name: string]: DefinitionDiff;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface GenericDefinition {
  hash: number;
  displayProperties?: {
    name?: string;
    description?: string;
    icon?: string;
  };
}
