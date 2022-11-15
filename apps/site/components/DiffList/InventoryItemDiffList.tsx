import BungieImage from "../BungieImage";
import ItemSummary from "../ItemSummary";
import HashLink from "../HashLink";

import s from "./styles.module.scss";
import React from "react";
import { QuestMarker } from "../QuestMarkers";
import { DiffListProps } from "./types";
import { castDefinitions } from "../../lib/utils";

const CLASS_TYPE_NAME: { [k: string]: string } = {
  [1]: "Hunter",
  [2]: "Warlock",
  [0]: "Titan",
};

export default function InventoryItemDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
}: Omit<DiffListProps, "title">) {
  if (hashes.length == 0) {
    return null;
  }

  const definitions = castDefinitions("DestinyInventoryItemDefinition", tableName, genericDefinitions);

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

  const isQuests = false;
  const isWeapon = false;
  const isArmor = false;

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
                <HashLink hash={hash} tableName={tableName} />
              </td>

              <td>
                <ItemSummary definition={def} definitions={definitions} />
              </td>

              {hasObjectives && (
                <td className={s.objectives}>
                  objectives
                </td>
              )}

              <td className={s.nowrap}>{def.itemTypeDisplayName}</td>

              {isWeapon && (
                <>
                  <td>weapon slot</td>
                </>
              )}

              {isArmor && <td>{CLASS_TYPE_NAME[def.classType]}</td>}

              {hasSource && <td>source string</td>}

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
