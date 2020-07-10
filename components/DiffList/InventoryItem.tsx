import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
} from "../../types";
import BungieImage from "../BungieImage";

import s from "./styles.module.scss";
import ItemSummary from "../ItemSummary";

interface InventoryItemDiffListProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
}

function getIconSrc(def: AnyDefinition & BareDestinyDefinition) {
  return def?.displayProperties?.icon;
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
              <td className={s.nowrap}>{def.itemTypeAndTierDisplayName}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
