import {
  // DestinyManifestComponentName,
  AllDestinyManifestComponents as OrigAllDestinyManifestComponents,

  // Definitions
  DestinyInventoryItemDefinition as _DestinyInventoryItemDefinition,
  DestinyObjectiveDefinition as _DestinyObjectiveDefinition,
  DestinyCollectibleDefinition as _DestinyCollectibleDefinition,
  DestinyVendorDefinition as _DestinyVendorDefinition,
  DestinyPresentationNodeDefinition as _DestinyPresentationNodeDefinition,
  DestinyDestinationDefinition as _DestinyDestinationDefinition,
  DestinyPlaceDefinition as _DestinyPlaceDefinition,
  DestinyRecordDefinition as _DestinyRecordDefinition,
  DestinyMetricDefinition as _DestinyMetricDefinition,
  DestinyLoadoutNameDefinition as _DestinyLoadoutNameDefinition,
  DestinyLoadoutIconDefinition as _DestinyLoadoutIconDefinition,
  DestinyLoadoutColorDefinition as _DestinyLoadoutColorDefinition,
} from "bungie-api-ts/destiny2";

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

export type DeepPartial<T> = unknown extends T
  ? T
  : T extends object
  ? {
      [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>;
    }
  : T;

export type HashGroup = [string, number[]][];

//
// Definition types
//
export type GenericDefinition = DestinyDefinitionFrom<
  keyof AllDestinyManifestComponents
>;

const def = {} as GenericDefinition;

export interface DefinitionTable<T = GenericDefinition> {
  [hash: string]: T;
}

interface Hello {
  world?: string;
  name?: string;
}

type Full<T> = {
  [P in keyof T]-?: T[P];
};

export type AllDestinyManifestComponents = {
  DestinyInventoryItemDefinition?: DefinitionTable<DestinyInventoryItemDefinition>;
  DestinyObjectiveDefinition?: DefinitionTable<DestinyObjectiveDefinition>;
  DestinyCollectibleDefinition?: DefinitionTable<DestinyCollectibleDefinition>;
  DestinyVendorDefinition?: DefinitionTable<DestinyVendorDefinition>;
  DestinyPresentationNodeDefinition?: DefinitionTable<DestinyPresentationNodeDefinition>;
  DestinyDestinationDefinition?: DefinitionTable<DestinyDestinationDefinition>;
  DestinyPlaceDefinition?: DefinitionTable<DestinyPlaceDefinition>;
  DestinyRecordDefinition?: DefinitionTable<DestinyRecordDefinition>;
  DestinyMetricDefinition?: DefinitionTable<DestinyMetricDefinition>;

  DestinyLoadoutNameDefinition?: DefinitionTable<DestinyLoadoutNameDefinition>;
  DestinyLoadoutIconDefinition?: DefinitionTable<DestinyLoadoutIconDefinition>;
  DestinyLoadoutColorDefinition?: DefinitionTable<DestinyLoadoutColorDefinition>;
};

export type DestinyManifestComponentName = keyof AllDestinyManifestComponents;

interface HackTempProperties {
  name?: string;
  iconImagePath?: string;
  colorImagePath?: string;
}

export declare type DestinyDefinitionFrom<
  K extends DestinyManifestComponentName
> = DeepPartial<Full<AllDestinyManifestComponents>[K][number]>;

export type DestinyInventoryItemDefinition = DeepPartial<
  _DestinyInventoryItemDefinition & HackTempProperties
>;

export type DestinyObjectiveDefinition =
  DeepPartial<_DestinyObjectiveDefinition>;

export type DestinyCollectibleDefinition =
  DeepPartial<_DestinyCollectibleDefinition>;

export type DestinyVendorDefinition = DeepPartial<_DestinyVendorDefinition>;

export type DestinyPresentationNodeDefinition =
  DeepPartial<_DestinyPresentationNodeDefinition>;

export type DestinyDestinationDefinition =
  DeepPartial<_DestinyDestinationDefinition>;

export type DestinyRecordDefinition = DeepPartial<_DestinyRecordDefinition>;

export type DestinyMetricDefinition = DeepPartial<_DestinyMetricDefinition>;

export type DestinyPlaceDefinition = DeepPartial<_DestinyPlaceDefinition>;

export type DestinyLoadoutNameDefinition =
  DeepPartial<_DestinyLoadoutNameDefinition>;
export type DestinyLoadoutIconDefinition =
  DeepPartial<_DestinyLoadoutIconDefinition>;
export type DestinyLoadoutColorDefinition =
  DeepPartial<_DestinyLoadoutColorDefinition>;
