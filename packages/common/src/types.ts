export interface ManifestVersion {
  readonly id: string;
  readonly version: string;
  readonly s3Key: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface DefinitionTableDiff {
  readonly removed: number[];
  readonly added: number[];
  readonly unclassified: number[];
  readonly reclassified: number[];
  readonly modified?: number[];
}

export interface VersionDiff {
  [definitionTableName: string]: DefinitionTableDiff;
}

export interface GenericDefinition {
  hash: number;
  index: number;
  displayProperties?: {
    name?: string;
    description?: string;
    icon?: string;
  };
}

export interface GenericDefinitionTable {
  [hash: string]: GenericDefinition;
}
