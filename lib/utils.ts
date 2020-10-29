import {
  AllDestinyManifestComponentsTagged,
  AnyDefinition,
  AnyDefinitionTable,
  BareDestinyDefinition,
  DestinyInventoryItemDefinitionTagged,
} from "../types";

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

export function castDefinitions<T>(
  defs: AnyDefinitionTable,
  tableName: keyof AllDestinyManifestComponentsTagged
) {
  const isValid = Object.values(defs).every((d) => d.__type === tableName);

  if (!isValid) {
    throw new Error(
      `Tried to cast table to ${tableName} but they're not all that type`
    );
  }

  return (defs as unknown) as T;
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
