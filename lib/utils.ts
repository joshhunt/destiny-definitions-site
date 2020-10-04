import {
  AnyDefinitionTable,
  DestinyInventoryItemDefinitionTagged,
} from "../types";

export function friendlyDiffName(name: string) {
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
