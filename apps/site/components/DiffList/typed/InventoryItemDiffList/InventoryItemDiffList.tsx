import BungieImage from "../../../BungieImage";
import ItemSummary from "../../../ItemSummary";
import HashLink from "../../../HashLink";

import s from "../../styles.module.scss";
import React from "react";
import { QuestMarker } from "../../../QuestMarkers";
import { TypedDiffListProps } from "../../types";
import { castDefinitionsTable } from "../../../../lib/utils";
import Table, {
  Cell,
  NoWrapCell,
  SmallCell,
  TableBody,
  TableHeader,
} from "../../../DiffTable";
import QuestObjectives from "../../../QuestObjectives";
import { ItemCategory } from "./categorise";
import { DestinyInventoryItemDefinition } from "@destiny-definitions/common";

const CLASS_TYPE_NAME: { [k: string]: string } = {
  [1]: "Hunter",
  [2]: "Warlock",
  [0]: "Titan",
};

export default function InventoryItemDiffList({
  version,
  tableName,
  hashes,
  definitions: genericDefinitions,
  otherDefinitions,
  itemCategory,
}: TypedDiffListProps & { itemCategory: string }) {
  if (hashes.length == 0) {
    return null;
  }

  const definitions = castDefinitionsTable(
    "DestinyInventoryItemDefinition",
    tableName,
    genericDefinitions
  );

  const {
    DestinyCollectibleDefinition: collectibleDefs = {},
    DestinyObjectiveDefinition: objectiveDefs = {},
  } = otherDefinitions;

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

  const isWeapon = itemCategory == ItemCategory.Weapon;
  const isArmor = itemCategory == ItemCategory.Armor;
  const isQuests = itemCategory === ItemCategory.Quest;

  return (
    <Table>
      <TableHeader>
        {isQuests && <Cell>Quest</Cell>}
        <SmallCell>Hash</SmallCell>
        <Cell>Item</Cell>
        {hasObjectives && <Cell>Objectives</Cell>}
        <Cell>Type</Cell>
        {isWeapon && <Cell>Slot</Cell>}
        {isArmor && <Cell>Class</Cell>}
        {hasSource && <Cell>Source</Cell>}
        {hasScreenshot && <Cell>Screenshot</Cell>}
      </TableHeader>

      <TableBody>
        {hashes.map((hash) => {
          const def = definitions[hash];
          if (!def) {
            return null;
          }

          const sourceString =
            collectibleDefs[def.collectibleHash ?? 0]?.sourceString;
          const objectives = def?.objectives?.objectiveHashes || [];

          return (
            <tr key={hash}>
              {isQuests && (
                <SmallCell>
                  <QuestMarker
                    version={version}
                    definitions={definitions}
                    siblingDiffHashes={hashes}
                    definition={def}
                  />
                </SmallCell>
              )}

              <SmallCell>
                <HashLink hash={hash} tableName={tableName} />
              </SmallCell>

              <Cell>
                <ItemSummary
                  definition={def}
                  definitions={definitions}
                  otherDefinitions={otherDefinitions}
                />
              </Cell>

              {hasObjectives && (
                <Cell>
                  {objectiveDefs && (
                    <QuestObjectives
                      objectiveHashes={objectives}
                      objectiveDefinitions={objectiveDefs}
                    />
                  )}
                </Cell>
              )}

              <NoWrapCell>{def.itemTypeDisplayName}</NoWrapCell>

              {isWeapon && <Cell>{getWeaponSlot(def)}</Cell>}

              {isArmor && (
                <Cell>
                  {CLASS_TYPE_NAME[def.classType] ?? <em>Unknown</em>}
                </Cell>
              )}

              {hasSource && <Cell>{sourceString}</Cell>}

              {hasScreenshot && (
                <Cell>
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
                          def.displayProperties?.name
                            ? `Screenshot of "${def.displayProperties.name}"`
                            : "Screenshot of this item"
                        }
                      />
                    </a>
                  )}
                </Cell>
              )}
            </tr>
          );
        })}
      </TableBody>
    </Table>
  );
}

const getWeaponSlot = (itemDef: DestinyInventoryItemDefinition) => {
  if (itemDef.itemCategoryHashes?.includes(2)) return "Kinetic"; // kinetic
  if (itemDef.itemCategoryHashes?.includes(3)) return "Energy"; // energy
  if (itemDef.itemCategoryHashes?.includes(4)) return "Power"; // power
};
