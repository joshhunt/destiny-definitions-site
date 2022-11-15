import { DestinyDefinitionFrom, DestinyManifestComponentName } from "bungie-api-ts/destiny2";
import _tableNameMappings from "./tableNameMappings.json";

const tableNameMappings = _tableNameMappings as Record<string, string>;

export function friendlyDiffName(name: string, useMobileName = true) {
  if (useMobileName && tableNameMappings[name]) {
    return tableNameMappings[name];
  }

  const match = name.match(/Destiny(\w+)Definition/);

  return match ? match[1] : name;
}

export function isAllInventoryItems(
  defs: AnyDefinitionTable
): defs is Record<string, DestinyInventoryItemDefinitionTagged> {
  return Object.values(defs).every(
    (d) => d.__type === "DestinyInventoryItemDefinition"
  );
}

export function castDefinitions<T extends DestinyManifestComponentName = DestinyManifestComponentName>(
  castToTableName: T,
  inputTableName: string,
  defs: Record<string, unknown>,
): Record<string, DestinyDefinitionFrom<T>> {
  const isValid = inputTableName === castToTableName;

  if (!isValid) {
    throw new Error(
      `Unable to cast ${inputTableName} to ${castToTableName}`
    );
  }

  return defs as Record<string, DestinyDefinitionFrom<T>>
}

export function getDisplayName(def: AnyDefinition & BareDestinyDefinition) {
  return def?.displayProperties?.name;
}

export function getIconSrc(def: AnyDefinition & BareDestinyDefinition) {
  return def?.displayProperties?.icon;
}

export function getDescription(def: AnyDefinition & BareDestinyDefinition) {
  return def?.displayProperties?.description;
}
