import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { AllDestinyManifestComponentsTagged } from "../../types";
import { sortBy } from "lodash";

type ItemDefinition = DestinyInventoryItemDefinition & {
  __type: "DestinyInventoryItemDefinition";
};
type ItemDefinitions = AllDestinyManifestComponentsTagged["DestinyInventoryItemDefinition"];

const noNameSorter = (itemDef: ItemDefinition) =>
  itemDef.displayProperties.name == ""
    ? Number.MAX_SAFE_INTEGER + 1
    : Number.MIN_SAFE_INTEGER;

const isDummySorter = (itemDef: ItemDefinition) =>
  itemDef.itemCategoryHashes?.includes(3109687656)
    ? Number.MAX_SAFE_INTEGER + 2
    : Number.MIN_SAFE_INTEGER;

const isClassified = (itemDef: ItemDefinition) =>
  itemDef.redacted ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;

const itemTierSorter = (itemDef: ItemDefinition) =>
  (itemDef.inventory?.tierType || 0) * -1;

const itemClassSorter = (itemDef: ItemDefinition) => {
  return itemDef.classType;
};

const rpmSorter = (itemDef: ItemDefinition) => {
  return itemDef.stats?.stats?.[4284893193]?.value;
};

const weaponSlotSorter = (itemDef: ItemDefinition) => {
  if (itemDef.itemCategoryHashes?.includes(2)) return 1; // kinetic
  if (itemDef.itemCategoryHashes?.includes(3)) return 2; // energy
  if (itemDef.itemCategoryHashes?.includes(4)) return 3; // power
};

const weaponTypeSorter = (itemDef: ItemDefinition) =>
  itemDef.traitIds?.find((v) => v.includes("weapon_type."));

const damageTypeSorter = (itemDef: ItemDefinition) =>
  (itemDef.damageTypes || [])[0];

const indexSorter = (itemDef: ItemDefinition) => itemDef.index;

// This is the array to add new sorters to!!
const ITEM_SORTERS = [
  isClassified,
  noNameSorter,
  isDummySorter,
  itemTierSorter,
  // weaponSlotSorter,
  // weaponTypeSorter,
  // damageTypeSorter,
  // rpmSorter,
  indexSorter,
  // itemClassSorter,
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
