import {
  AnyDefinitionTable,
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
