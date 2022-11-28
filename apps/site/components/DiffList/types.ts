import {
  AllDestinyManifestComponents,
  DefinitionTable,
  ManifestVersion,
} from "@destiny-definitions/common";

export interface DiffListProps {
  version: ManifestVersion;
  title: string;
  tableName: string;
  diffTypeSlug: string;
  hashes: number[];
  fullHashCount: number;
  definitions: DefinitionTable;
  otherDefinitions: AllDestinyManifestComponents;
}

export type TypedDiffListProps = Omit<DiffListProps, "title">;
