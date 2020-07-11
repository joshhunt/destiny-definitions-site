import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
  ItemCategory,
  ItemCategoryValues,
} from "../../types";
import BungieImage from "../BungieImage";

import s from "./styles.module.scss";
import ItemSummary from "../ItemSummary";
import { Dictionary } from "lodash";

interface InventoryItemDiffListProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
}

export default function InventoryItemDiffList({
  hashes,
  definitions,
}: InventoryItemDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td>Hash</td>
          <td>Item</td>
          <td>Type</td>
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];
          if (!def || def.__type !== "DestinyInventoryItemDefinition")
            return null;

          return (
            <tr>
              <td>{hash}</td>
              <td className={s.mainColumn}>
                <ItemSummary def={def} />
              </td>
              <td className={s.nowrap}>{def.itemTypeDisplayName}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

interface GroupedDiffListProps {
  name: string;
  groupedHashes: Dictionary<number[]>;
  definitions: AnyDefinitionTable;
}

export function GroupedDiffList({
  groupedHashes,
  name,
  definitions,
}: GroupedDiffListProps) {
  const id = name.toLowerCase();

  return (
    <div>
      <h3 id={id}>{name}</h3>

      {Object.entries(groupedHashes)
        .sort(
          ([itemGroupA], [itemGroupB]) =>
            ItemCategoryValues.indexOf(itemGroupA) -
            ItemCategoryValues.indexOf(itemGroupB)
        )
        .map(([itemGroupName, hashes]) => {
          return (
            <>
              <h4 id={`${id}_${itemGroupName}`}>{itemGroupName}</h4>

              <InventoryItemDiffList
                hashes={hashes}
                definitions={definitions}
              />
            </>
          );
        })}
    </div>
  );
}
