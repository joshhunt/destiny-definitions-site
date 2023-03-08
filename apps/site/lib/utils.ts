import {
  DeepPartial,
  DefinitionTable,
  GenericDefinition,
  DestinyDefinitionFrom,
  DestinyManifestComponentName,
} from "@destiny-definitions/common";
import { DestinyDisplayPropertiesDefinition } from "bungie-api-ts/destiny2";
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

function hasDisplayProperties(
  def: GenericDefinition
): def is GenericDefinition & {
  displayProperties: DeepPartial<DestinyDisplayPropertiesDefinition>;
} {
  return "displayProperties" in def && def.displayProperties !== undefined;
}

export function getDisplayName(
  def: GenericDefinition | undefined
): string | undefined {
  if (!def) {
    return undefined;
  }

  if (
    hasDisplayProperties(def) &&
    "name" in def.displayProperties &&
    def.displayProperties.name
  ) {
    return def.displayProperties.name;
  }

  if ("name" in def && def.name) {
    return def.name;
  }
}

export function getIconSrc(
  def: GenericDefinition | undefined
): string | undefined {
  if (!def) {
    return undefined;
  }

  if (
    hasDisplayProperties(def) &&
    "icon" in def.displayProperties &&
    def.displayProperties.icon
  ) {
    return def.displayProperties.icon;
  }

  if ("iconImagePath" in def && def.iconImagePath) {
    return def.iconImagePath;
  }

  if ("colorImagePath" in def && def.colorImagePath) {
    return def.colorImagePath;
  }
}

export function getDescription(
  def: GenericDefinition | undefined
): string | undefined {
  if (!def) {
    return undefined;
  }

  if (
    hasDisplayProperties(def) &&
    "description" in def.displayProperties &&
    def.displayProperties.description
  ) {
    return def.displayProperties.description;
  }
}
