import { mapValues, groupBy, sortBy } from "lodash";

import {
  ItemCategory,
  DestinyInventoryItemDefinitionTagged,
  DefinitionDiff,
  AnyDefinitionTable,
  AllDestinyManifestComponentsTagged,
  PossiblyGroupedDiff,
} from "../../types";
import sortItems from "./sortItems";

const ifNeedsPrevDefs = (s: string) => s === "removed" || s === "reclassified";

export function doGrouping(
  diff: DefinitionDiff,
  _definitions: AnyDefinitionTable,
  _previousDefinitions: AnyDefinitionTable | null,
  definitionName: string
): PossiblyGroupedDiff {
  if (definitionName === "DestinyInventoryItemDefinition") {
    const definitions =
      _definitions as AllDestinyManifestComponentsTagged["DestinyInventoryItemDefinition"];
    const previousDefinitions = (_previousDefinitions ||
      _definitions) as AllDestinyManifestComponentsTagged["DestinyInventoryItemDefinition"];

    const groupedDiff = mapValues(diff, (hashes, diffSectionName) => {
      const definitionsForType = ifNeedsPrevDefs(diffSectionName)
        ? previousDefinitions
        : definitions;

      const sortedHashes = sortItems(hashes, definitionsForType);

      return sortedHashes.reduce((acc, itemHash) => {
        const itemDef = definitionsForType[itemHash];
        const category = itemDef
          ? categoryForItem(itemDef)
          : ItemCategory.Other;

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(itemHash);

        return acc;
      }, {} as Record<ItemCategory, number[]>);
    });

    return groupedDiff;
  }

  return mapValues(diff, (ddd) =>
    sortBy(ddd, [
      (hash) =>
        _definitions[hash]?.redacted
          ? Number.MAX_SAFE_INTEGER
          : Number.MIN_SAFE_INTEGER,

      (hash) => _definitions[hash]?.index,
    ])
  );
}

export function categoryForItem(itemDef: DestinyInventoryItemDefinitionTagged) {
  if (itemDef.itemCategoryHashes?.includes(1)) return ItemCategory.Weapon;

  if (itemDef.itemCategoryHashes?.includes(20)) return ItemCategory.Armor;

  if (itemDef.itemCategoryHashes?.includes(39)) return ItemCategory.Ghost;

  if (itemDef.itemCategoryHashes?.includes(44)) return ItemCategory.Emote;

  if (itemDef.itemCategoryHashes?.includes(19)) return ItemCategory.Emblem;

  if (itemDef.itemCategoryHashes?.includes(41)) return ItemCategory.Shader;

  if (itemDef.itemCategoryHashes?.includes(4)) return ItemCategory.Material;

  if (
    itemDef.itemCategoryHashes?.includes(2237038328) ||
    itemDef.itemCategoryHashes?.includes(3708671066)
  )
    return ItemCategory.WeaponPerk;

  if (itemDef.itemCategoryHashes?.includes(1112488720))
    return ItemCategory.Finisher;

  if (itemDef.itemCategoryHashes?.includes(1404791674))
    return ItemCategory.GhostProjection;

  if (itemDef.itemCategoryHashes?.includes(268598612))
    return ItemCategory.Eververse;

  if (itemDef.itemCategoryHashes?.includes(208981632))
    return ItemCategory.TransmatEffect;

  if (itemDef.traitIds?.includes("inventory_filtering.bounty"))
    return ItemCategory.Bounty;

  if (
    itemDef.itemCategoryHashes?.includes(34) ||
    itemDef.traitIds?.includes("item_type.engram")
  )
    return ItemCategory.Engram;

  if (
    itemDef.itemCategoryHashes?.includes(16) ||
    itemDef.itemCategoryHashes?.includes(53) ||
    itemDef.traitIds?.includes("inventory_filtering.quest")
  )
    return ItemCategory.Quest;

  if (
    itemDef.itemCategoryHashes?.includes(42) ||
    itemDef.itemCategoryHashes?.includes(43)
  )
    return ItemCategory.Vehicle;

  if (
    itemDef.itemCategoryHashes?.includes(3124752623) ||
    itemDef.itemCategoryHashes?.includes(1742617626) ||
    itemDef.itemSubType == 21
  )
    return ItemCategory.Ornament;

  // Mods must be after ornaments
  if (itemDef.itemCategoryHashes?.includes(59)) return ItemCategory.Mod;

  if (itemDef.inventory?.bucketTypeHash == 1469714392)
    return ItemCategory.Consumable;

  if (itemDef.seasonHash || itemDef.itemCategoryHashes?.includes(1378222069))
    return ItemCategory.SeasonalArtifact;

  return ItemCategory.Other;
}
