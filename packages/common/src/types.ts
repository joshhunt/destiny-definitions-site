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
} from "bungie-api-ts/destiny2";

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

export interface GroupedDefinitionTableDiff {
  readonly removed: HashGroup;
  readonly added: HashGroup;
  readonly unclassified: HashGroup;
  readonly reclassified: HashGroup;
  readonly modified: HashGroup;
}

export interface VersionDiff {
  [definitionTableName: string]: DefinitionTableDiff;
}

export interface GenericDefinition {
  hash?: number;
  index?: number;
  displayProperties?: {
    name?: string;
    description?: string;
    icon?: string;
  };
}

export interface DefinitionTable<T = GenericDefinition> {
  [hash: string]: T;
}

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
};

export declare type DestinyDefinitionFrom<
  K extends DestinyManifestComponentName
> = DeepPartial<OrigAllDestinyManifestComponents[K][number]>;

export type DestinyInventoryItemDefinition =
  DeepPartial<_DestinyInventoryItemDefinition>;

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

export type DestinyManifestComponentName = keyof AllDestinyManifestComponents;

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
