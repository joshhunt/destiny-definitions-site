import {
  AnyDefinitionTable,
  DestinyInventoryItemDefinitionTagged,
  ItemCategory,
} from "../../types";
import BungieImage from "../BungieImage";
import ItemSummary from "../ItemSummary";
import HashLink from "../HashLink";

import s from "./styles.module.scss";
import { isAllInventoryItems } from "../../lib/utils";

const CLASS_TYPE_NAME: { [k: string]: string } = {
  [1]: "Hunter",
  [2]: "Warlock",
  [0]: "Titan",
};

const getWeaponSlot = (itemDef: DestinyInventoryItemDefinitionTagged) => {
  if (itemDef.itemCategoryHashes?.includes(2)) return "Kinetic"; // kinetic
  if (itemDef.itemCategoryHashes?.includes(3)) return "Energy"; // energy
  if (itemDef.itemCategoryHashes?.includes(4)) return "Power"; // power
};

interface InventoryItemDiffListProps {
  definitionName: string;
  itemCategory: string;
  hashes: number[];
  definitions: AnyDefinitionTable;
}

export default function InventoryItemDiffList({
  definitionName,
  itemCategory,
  hashes,
  definitions,
}: InventoryItemDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  if (!isAllInventoryItems(definitions)) {
    throw new Error(
      "Fail to assert that all definitions are DestinyInventoryItemDefinition"
    );
  }

  const isWeapon = itemCategory == ItemCategory.Weapon;
  const isArmor = itemCategory == ItemCategory.Armor;

  const hasScreenshot = hashes.some((itemHash) => {
    const def = definitions[itemHash];
    return def && def.screenshot;
  });

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td>Hash</td>
          <td>Item</td>

          {hasScreenshot && <td>Screenshot</td>}

          <td>Type</td>

          {isWeapon && (
            <>
              <td>Slot</td>
            </>
          )}

          {isArmor && <td>Class</td>}
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];
          if (!def) {
            return null;
          }

          return (
            <tr key={hash}>
              <td>
                <HashLink hash={hash} definitionName={definitionName} />
              </td>

              <td className={s.mainColumn}>
                <ItemSummary def={def} definitions={definitions} />
              </td>

              {hasScreenshot && (
                <td>
                  {def.screenshot && (
                    <BungieImage
                      className={s.screenshotPreview}
                      src={def.screenshot}
                    />
                  )}
                </td>
              )}

              <td className={s.nowrap}>{def.itemTypeDisplayName}</td>

              {isWeapon && (
                <>
                  <td>{getWeaponSlot(def)}</td>
                </>
              )}

              {isArmor && <td>{CLASS_TYPE_NAME[def.classType]}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
