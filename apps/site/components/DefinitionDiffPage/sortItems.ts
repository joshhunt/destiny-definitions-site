import { sortBy } from "lodash";
import {
  DefinitionTable,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";

type ItemDefinitions = DefinitionTable<DestinyInventoryItemDefinition>;

const noNameSorter = (itemDef: DestinyInventoryItemDefinition) =>
  itemDef.displayProperties?.name == ""
    ? Number.MAX_SAFE_INTEGER + 1
    : Number.MIN_SAFE_INTEGER;

const isDummySorter = (itemDef: DestinyInventoryItemDefinition) =>
  itemDef.itemCategoryHashes?.includes(3109687656)
    ? Number.MAX_SAFE_INTEGER + 2
    : Number.MIN_SAFE_INTEGER;

const isClassified = (itemDef: DestinyInventoryItemDefinition) =>
  itemDef.redacted ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;

const itemTierSorter = (itemDef: DestinyInventoryItemDefinition) =>
  (itemDef.inventory?.tierType || 0) * -1;

const indexSorter = (itemDef: DestinyInventoryItemDefinition) => itemDef.index;

// This is the array to add new sorters to!!
const ITEM_SORTERS = [
  isClassified,
  noNameSorter,
  isDummySorter,
  itemTierSorter,
  indexSorter,
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
