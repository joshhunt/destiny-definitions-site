import DiffList from "../../DiffList";
import {
  DefinitionDiff,
  AnyDefinitionTable,
  AllDestinyManifestComponentsTagged,
  AnyDefinition,
  ItemCategory,
  ItemCategoryValues,
  ManifestVersion,
} from "../../../types";
import { ensureDefinitionType } from "../../../utils";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { InventoryItemGroupedDiffList } from "../../DiffList/InventoryItem";

import { mapValues, groupBy, sortBy, Dictionary } from "lodash";
import sortItems from "./sortItems";
import IndexTable from "../../IndexTable";

import s from "./styles.module.scss";

type ItemDefinition = DestinyInventoryItemDefinition & {
  __type: "DestinyInventoryItemDefinition";
};
type ItemDefinitions = AllDestinyManifestComponentsTagged["DestinyInventoryItemDefinition"];

interface FallbackDiffList {
  versionId: string;
  manifestVersion: ManifestVersion;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
}

function categoryForItem(itemDef: ItemDefinition) {
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
    return ItemCategory.Quests;

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
  if (itemDef.itemCategoryHashes?.includes(59)) return ItemCategory.Mods;

  if (itemDef.inventory.bucketTypeHash == 1469714392)
    return ItemCategory.Consumable;

  return ItemCategory.Other;
}

const ifNeedsPrevDefs = (s: string) => s === "removed" || s === "reclassified";

const groupHasItems = (group: Dictionary<number[]>) =>
  Object.values(group).some((v) => v.length);

export function InventoryItemDiff({
  definitionName,
  diff,
  definitions: _defs,
  previousDefinitions: _previousDefs,
}: FallbackDiffList) {
  // TODO: find a better way to do this
  const definitions = ensureDefinitionType<ItemDefinitions>(
    _defs,
    "DestinyInventoryItemDefinition"
  );
  const previousDefinitions = (_previousDefs as ItemDefinitions) || definitions;

  const groupedDiff = mapValues(diff, (hashes, diffSectionName) => {
    const definitionsForType = ifNeedsPrevDefs(diffSectionName)
      ? previousDefinitions
      : definitions;

    const sortedHashes = sortItems(hashes, definitionsForType);

    return groupBy(sortedHashes, (itemHash) => {
      const itemDef = definitionsForType[itemHash];
      if (!itemDef) return "other";

      return categoryForItem(itemDef);
    });
  });

  const indexData = Object.entries(groupedDiff)
    .map(([diffSectionName, groupedHashes]) => {
      return {
        name: diffSectionName,
        count: Object.values(groupedHashes).reduce(
          (acc, n) => acc + n.length,
          0
        ),
        subItems: Object.entries(groupedHashes)
          .map(([itemCategory, hashes]) => {
            return {
              name: itemCategory,
              count: hashes.length,
            };
          })
          .sort((a, b) => {
            return (
              ItemCategoryValues.indexOf(a.name) -
              ItemCategoryValues.indexOf(b.name)
            );
          }),
      };
    })
    .filter((v) => v.count > 0);

  return (
    <div className={s.layout}>
      <div className={s.main}>
        {groupHasItems(groupedDiff.added) && (
          <InventoryItemGroupedDiffList
            name="Added"
            groupedHashes={groupedDiff.added}
            definitions={definitions}
          />
        )}
        {groupHasItems(groupedDiff.unclassified) && (
          <InventoryItemGroupedDiffList
            name="Unclassified"
            groupedHashes={groupedDiff.unclassified}
            definitions={definitions}
          />
        )}
        {groupHasItems(groupedDiff.removed) && (
          <InventoryItemGroupedDiffList
            name="Removed"
            groupedHashes={groupedDiff.removed}
            definitions={previousDefinitions}
          />
        )}
        {groupHasItems(groupedDiff.reclassified) && (
          <DiffList
            name="Reclassified"
            hashes={diff.reclassified}
            definitions={previousDefinitions}
          />
        )}
      </div>

      <div className={s.side}>
        <div className={s.stickySide}>
          <IndexTable data={indexData} />
        </div>
      </div>
    </div>
  );
}
