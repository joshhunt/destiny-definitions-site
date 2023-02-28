import {
  DeepPartial,
  DefinitionTable,
  GenericDefinition,
} from "@destiny-definitions/common";
import {
  DestinyDefinitionFrom,
  DestinyManifestComponentName,
} from "bungie-api-ts/destiny2";
import _tableNameMappings from "./tableNameMappings.json";

const tableNameMappings = _tableNameMappings as Record<string, string>;

export function friendlyTableName(name: string, useMobileName = true) {
  if (useMobileName && tableNameMappings[name]) {
    return tableNameMappings[name];
  }

  const match = name.match(/Destiny(\w+)Definition/);

  return match ? match[1] : name;
}

export function castDefinitionsTable<
  T extends DestinyManifestComponentName = DestinyManifestComponentName
>(
  castToTableName: T,
  inputTableName: string,
  defs: DefinitionTable<unknown>
): DefinitionTable<DestinyDefinitionFrom<T>> {
  const isValid = inputTableName === castToTableName;

  if (!isValid) {
    throw new Error(`Unable to cast ${inputTableName} to ${castToTableName}`);
  }

  return defs as DefinitionTable<DestinyDefinitionFrom<T>>;
}

export function castDefinition<
  T extends DestinyManifestComponentName = DestinyManifestComponentName
>(
  castToTableName: T,
  inputTableName: string,
  definition: unknown
): DestinyDefinitionFrom<T> {
  const isValid = inputTableName === castToTableName;

  if (!isValid) {
    throw new Error(`Unable to cast ${inputTableName} to ${castToTableName}`);
  }

  return definition as DestinyDefinitionFrom<T>;
}

export function isTableType<
  T extends DestinyManifestComponentName = DestinyManifestComponentName
>(
  castToTableName: T,
  inputTableName: string,
  defs: Record<string, unknown>
): defs is DefinitionTable<DeepPartial<DestinyDefinitionFrom<T>>> {
  return inputTableName === castToTableName;
}

export function getDisplayName(def: GenericDefinition | undefined) {
  return def?.displayProperties?.name || def?.name;
}

export function getIconSrc(def: GenericDefinition | undefined) {
  return def?.displayProperties?.icon;
}

export function getDescription(def: GenericDefinition | undefined) {
  return def?.displayProperties?.description;
}
