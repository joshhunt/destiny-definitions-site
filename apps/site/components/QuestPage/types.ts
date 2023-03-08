import {
  DestinyInventoryItemDefinition,
  DestinyVendorDefinition,
  DestinyObjectiveDefinition,
} from "@destiny-definitions/common";
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

export type QuestItem = DestinyInventoryItemDefinition;
export type QuestVendor = DestinyVendorDefinition;
export type QuestObjective = DestinyObjectiveDefinition;

export type InteractionRewardSet = Record<
  number,
  {
    [interactionIndex: number]: number[];
  }
>;
