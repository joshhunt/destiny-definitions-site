import {
  AllDestinyManifestComponents,
  DefinitionTable,
} from "@destiny-definitions/common";

export interface DiffListProps {
  title: string;
  tableName: string;
  hashes: number[];
  definitions: DefinitionTable;
  otherDefinitions: AllDestinyManifestComponents;
}
