import { AllDestinyManifestComponents as OrigAllDestinyManifestComponents } from "bungie-api-ts/destiny2";

import { DeepPartial } from "./tsUtils";

export type GenericDefinition = DestinyDefinitionFrom<
  keyof AllDestinyManifestComponents
>;

export interface DefinitionTable<T = GenericDefinition> {
  [hash: string]: T;
}

type NonPartial<T> = {
  [P in keyof T]-?: T[P];
};

// Make all definitions DeepPartial, and pretend to add the __typeThisPropertyDoesntExist to typescript
// won't collapse down a union of all definitions
export type AllDestinyManifestComponents = {
  [TableName in keyof OrigAllDestinyManifestComponents]?: DefinitionTable<
    DeepPartial<OrigAllDestinyManifestComponents[TableName][number]> & {
      __typeThisPropertyDoesntExist: TableName;
    }
  >;
};

export type DestinyManifestComponentName = keyof AllDestinyManifestComponents;

export declare type DestinyDefinitionFrom<
  K extends DestinyManifestComponentName
> = NonPartial<AllDestinyManifestComponents>[K][number];

export type DestinyInventoryItemDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyInventoryItemDefinition"][number];

export type DestinyObjectiveDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyObjectiveDefinition"][number];

export type DestinyCollectibleDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyCollectibleDefinition"][number];

export type DestinyVendorDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyVendorDefinition"][number];

export type DestinyPresentationNodeDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyPresentationNodeDefinition"][number];

export type DestinyDestinationDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyDestinationDefinition"][number];

export type DestinyRecordDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyRecordDefinition"][number];

export type DestinyMetricDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyMetricDefinition"][number];

export type DestinyPlaceDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyPlaceDefinition"][number];

export type DestinyLoadoutNameDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyLoadoutNameDefinition"][number];

export type DestinyLoadoutIconDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyLoadoutIconDefinition"][number];

export type DestinyLoadoutColorDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinyLoadoutColorDefinition"][number];

export type DestinySocketCategoryDefinition =
  NonPartial<AllDestinyManifestComponents>["DestinySocketCategoryDefinition"][number];
