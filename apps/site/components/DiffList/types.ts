import { GenericDefinitionTable } from "@destiny-definitions/common";
import {
  DestinyDefinitionFrom,
  DestinyManifestComponentName,
} from "bungie-api-ts/destiny2";

export interface DiffListProps {
  title: string;
  tableName: string;
  hashes: number[];
  definitions: GenericDefinitionTable;
}