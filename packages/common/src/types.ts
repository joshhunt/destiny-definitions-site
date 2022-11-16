import {
  AllDestinyManifestComponents as OrigAllDestinyManifestComponents,
  DestinyInventoryItemDefinition as _DestinyInventoryItemDefinition,
  DestinyObjectiveDefinition as _DestinyObjectiveDefinition,
  DestinyCollectibleDefinition as _DestinyCollectibleDefinition,
  DestinyVendorDefinition as _DestinyVendorDefinition,
  DestinyPresentationNodeDefinition as _DestinyPresentationNodeDefinition,
  DestinyManifestComponentName,
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

export interface DefinitionTable<T = GenericDefinition> {
  [hash: string]: T;
}

export type AllDestinyManifestComponents =
  DeepPartial<OrigAllDestinyManifestComponents>;

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

type DeepPartial<T> = unknown extends T
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
