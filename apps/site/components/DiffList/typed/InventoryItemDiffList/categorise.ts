import {
  DefinitionTable,
  DefinitionTableDiff,
  DestinyInventoryItemDefinition,
  GroupedDefinitionTableDiff,
  HashGroup,
} from "@destiny-definitions/common";
import { sortBy } from "lodash";

import sortItems from "./sortItems";

export enum ItemCategory {
  Weapon = "Weapon",
  Armor = "Armor",
  Ghost = "Ghost",
  Quest = "Quest",
  Bounty = "Bounty",
  Emote = "Emote",
  Emblem = "Emblem",
  Vehicle = "Vehicle",
  Ornament = "Ornament",
  Finisher = "Finisher",
  Shader = "Shader",
  Mod = "Mod",
  Material = "Material",
  Consumable = "Consumable",
  Engram = "Engram",
  WeaponPerk = "Weapon Perk",
  TransmatEffect = "Transmat effect",
  GhostProjection = "Ghost Projection",
  SeasonalArtifact = "Seasonal Artifact",
  Eververse = "Eververse",
  Other = "Other",
}

const itemCategoryValues: string[] = Object.values(ItemCategory);

export function groupHashes(
  hashes: number[],
  definitions: DefinitionTable<DestinyInventoryItemDefinition>
): HashGroup {
  const sortedHashes = sortItems(hashes, definitions);

  const groups: HashGroup = [];

  for (const itemHash of sortedHashes) {
    const itemDef = definitions[itemHash];
    const category = itemDef ? categoryForItem(itemDef) : ItemCategory.Other;

    let group = groups.find((g) => g[0] === category);
    if (!group) {
      group = [category, []];
      groups.push(group);
    }

    group[1].push(itemHash);
  }

  const sortedGroups = sortBy(groups, ([group]) =>
    itemCategoryValues.indexOf(group)
  );

  return sortedGroups;
}

// Takes a table diff ({added: number[], modified: number[], etc}) and returns that but grouped
export function groupTableDiff(
  diff: DefinitionTableDiff,
  definitions: DefinitionTable<DestinyInventoryItemDefinition>,
  previousDefinitions: DefinitionTable<DestinyInventoryItemDefinition>
): GroupedDefinitionTableDiff {
  const groupTableDiff = {
    removed: groupHashes(diff.removed, previousDefinitions),
    added: groupHashes(diff.added, definitions),
    unclassified: groupHashes(diff.unclassified, definitions),
    reclassified: groupHashes(diff.reclassified, previousDefinitions),
    modified: groupHashes(diff.modified ?? [], definitions),
  };

  return groupTableDiff;
}

export function categoryForItem(itemDef: DestinyInventoryItemDefinition) {
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
