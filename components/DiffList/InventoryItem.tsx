import {
  AllDestinyManifestComponentsTagged,
  DestinyInventoryItemDefinitionTagged,
  ItemCategory,
} from "../../types";
import BungieImage from "../BungieImage";
import ItemSummary from "../ItemSummary";
import HashLink from "../HashLink";

import s from "./styles.module.scss";
import React from "react";
import { QuestMarker } from "../QuestMarkers";
import QuestObjectives from "../QuestObjectives";

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
  definitions: AllDestinyManifestComponentsTagged["DestinyInventoryItemDefinition"];
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
}

export default function InventoryItemDiffList({
  definitionName,
  itemCategory,
  hashes,
  definitions,
  otherDefinitions,
}: InventoryItemDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const {
    DestinyCollectibleDefinition: collectibleDefs,
    DestinyObjectiveDefinition: objectiveDefs,
  } = otherDefinitions;

  const isWeapon = itemCategory == ItemCategory.Weapon;
  const isArmor = itemCategory == ItemCategory.Armor;
  const isQuests = itemCategory === ItemCategory.Quest;

  const hasScreenshot = hashes.some(
    (itemHash) => definitions[itemHash]?.screenshot
  );

  const hasSource = hashes.some(
    (itemHash) => definitions[itemHash]?.collectibleHash
  );

  const hasObjectives = hashes.some(
    (itemHash) =>
      (definitions[itemHash]?.objectives?.objectiveHashes?.length ?? 0) > 0
  );

  return (
    <table className={s.table}>
      <thead className={s.tableHeader}>
        <tr>
          {isQuests && <td>Quest</td>}

          <td>Hash</td>
          <td>Item</td>

          {hasObjectives && <td>Objectives</td>}

          <td>Type</td>

          {isWeapon && (
            <>
              <td>Slot</td>
            </>
          )}

          {isArmor && <td>Class</td>}

          {hasSource && <td>Source</td>}

          {hasScreenshot && <td>Screenshot</td>}
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];
          if (!def) {
            return null;
          }

          const sourceString =
            collectibleDefs?.[def.collectibleHash ?? ""]?.sourceString;

          const objectives = def?.objectives?.objectiveHashes || [];

          return (
            <tr key={hash}>
              {isQuests && (
                <td className={s.questMarker}>
                  <QuestMarker
                    definitions={definitions}
                    siblingDiffHashes={hashes}
                    definition={def}
                  />
                </td>
              )}

              <td className={s.shrink}>
                <HashLink hash={hash} definitionName={definitionName} />
              </td>

              <td>
                <ItemSummary definition={def} definitions={definitions} />
              </td>

              {hasObjectives && (
                <td className={s.objectives}>
                  {objectiveDefs && (
                    <QuestObjectives
                      objectiveHashes={objectives}
                      objectiveDefinitions={objectiveDefs}
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

              {hasSource && <td>{sourceString}</td>}

              {hasScreenshot && (
                <td>
                  {def.screenshot && (
                    <a
                      href={`https://www.bungie.net${def.screenshot}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BungieImage
                        className={s.screenshotPreview}
                        src={def.screenshot}
                        alt={
                          def.displayProperties.name
                            ? `Screenshot of "${def.displayProperties.name}"`
                            : "Screenshot of this item"
                        }
                      />
                    </a>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
