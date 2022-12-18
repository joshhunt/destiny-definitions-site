import {
  DestinyInventoryItemDefinition,
  DestinyObjectiveDefinition,
  DestinyVendorDefinition,
} from "bungie-api-ts/destiny2/interfaces";
import { pick } from "lodash";

export function createQuestItem(item: DestinyInventoryItemDefinition) {
  return pick(
    item,
    "hash",
    "displayProperties",
    "setData",
    "objectives",
    "itemTypeAndTierDisplayName",
    "displaySource"
  );
}

export function createQuestVendor(vendor: DestinyVendorDefinition) {
  return pick(vendor, "hash", "displayProperties", "interactions");
}

export function createQuestObjective(objective: DestinyObjectiveDefinition) {
  return pick(
    objective,
    "hash",
    "displayProperties",
    "progressDescription",
    "valueStyle",
    "completionValue"
  );
}

export type QuestItem = ReturnType<typeof createQuestItem>;
export type QuestVendor = ReturnType<typeof createQuestVendor>;
export type QuestObjective = ReturnType<typeof createQuestObjective>;

export type InteractionRewardSet = Record<
  number,
  {
    [interactionIndex: number]: number[];
  }
>;
