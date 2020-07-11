import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { AllDestinyManifestComponentsTagged } from "../../../types";
import { sortBy } from "lodash";

type ItemDefinition = DestinyInventoryItemDefinition & {
  __type: "DestinyInventoryItemDefinition";
};
type ItemDefinitions = AllDestinyManifestComponentsTagged["DestinyInventoryItemDefinition"];

const isDummySorter = (itemDef: ItemDefinition) =>
  itemDef.itemCategoryHashes?.includes(3109687656)
    ? Number.MAX_SAFE_INTEGER
    : Number.MIN_SAFE_INTEGER;

const itemTierSorter = (itemDef: ItemDefinition) =>
  (itemDef.inventory?.tierType || 0) * -1;

const itemClassSorter = (itemDef: ItemDefinition) => {
  return itemDef.classType;
};

const weaponSlotSorter = (itemDef: ItemDefinition) => {
  if (itemDef.itemCategoryHashes?.includes(2)) return 1; // kinetic
  if (itemDef.itemCategoryHashes?.includes(3)) return 2; // energy
  if (itemDef.itemCategoryHashes?.includes(4)) return 3; // power
};

const weaponTypeSorter = (itemDef: ItemDefinition) =>
  itemDef.traitIds?.find((v) => v.includes("weapon_type."));

// This is the array to add new sorters to!!
const ITEM_SORTERS = [
  isDummySorter,
  itemTierSorter,
  itemClassSorter,
  weaponSlotSorter,
  weaponTypeSorter,
];

/*
  Here be dragons
*/
const itemSorters = ITEM_SORTERS.map((originalFn) => {
  return (definitions: ItemDefinitions, itemHash: number) => {
    const itemDef = definitions[itemHash];
    return itemDef ? originalFn(itemDef) : Number.MAX_SAFE_INTEGER;
  };
});

export default function sortItems(
  hashes: number[],
  definitions: ItemDefinitions
) {
  const sortFns = itemSorters.map((fn) => fn.bind(null, definitions));
  return sortBy(hashes, sortFns);
}
