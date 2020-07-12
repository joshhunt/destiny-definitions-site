import DiffList from "../../DiffList";
import {
  DefinitionDiff,
  AnyDefinitionTable,
  AllDestinyManifestComponentsTagged,
  AnyDefinition,
  ItemCategory,
  ItemCategoryValues,
} from "../../../types";
import { ensureDefinitionType } from "../../../utils";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { InventoryItemGroupedDiffList } from "../../DiffList/InventoryItem";

import { mapValues, groupBy, sortBy } from "lodash";
import sortItems from "./sortItems";
import IndexTable from "../../IndexTable";

import s from "./styles.module.scss";

type ItemDefinition = DestinyInventoryItemDefinition & {
  __type: "DestinyInventoryItemDefinition";
};
type ItemDefinitions = AllDestinyManifestComponentsTagged["DestinyInventoryItemDefinition"];

interface FallbackDiffList {
  versionId: string;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
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

export function InventoryItemDiff({
  versionId,
  definitionName,
  diff,
  definitions: _defs,
}: FallbackDiffList) {
  // TODO: find a better way to do this
  ensureDefinitionType(_defs, "DestinyInventoryItemDefinition");
  const definitions = _defs as ItemDefinitions;

  const groupedDiff = mapValues(diff, (hashes) => {
    const sortedHashes = sortItems(hashes, definitions);

    return groupBy(sortedHashes, (itemHash) => {
      const itemDef = definitions[itemHash];
      if (!itemDef) return "other";

      return categoryForItem(itemDef);
    });
  });

  console.log({ ItemCategoryValues });
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
            const valueA = ItemCategoryValues.indexOf(a.name);
            const valueB = ItemCategoryValues.indexOf(b.name);

            console.log("sort", { a: a.name, b: b.name, valueA, valueB });

            return valueA - valueB;
          }),
      };
    })
    .filter((v) => v.count > 0);

  return (
    <>
      <h1>Version {versionId}</h1>
      <div className={s.layout}>
        <div className={s.main}>
          <h2>{definitionName}</h2>

          <InventoryItemGroupedDiffList
            name="Added"
            groupedHashes={groupedDiff.added}
            definitions={definitions}
          />
          <InventoryItemGroupedDiffList
            name="Unclassified"
            groupedHashes={groupedDiff.unclassified}
            definitions={definitions}
          />
          <DiffList
            name="Removed"
            hashes={diff.removed}
            definitions={definitions}
          />
          <DiffList
            name="Reclassified"
            hashes={diff.reclassified}
            definitions={definitions}
          />
        </div>

        <div className={s.side}>
          <div className={s.stickySide}>
            <IndexTable data={indexData} />
          </div>
        </div>
      </div>
    </>
  );
}
