import BungieImage from "../BungieImage";
import ItemSummary from "../ItemSummary";
import HashLink from "../HashLink";

import s from "./styles.module.scss";
import React from "react";
import { QuestMarker } from "../QuestMarkers";
import { DiffListProps } from "./types";
import { castDefinitionsTable } from "../../lib/utils";
import Table, {
  Cell,
  NoWrapCell,
  SmallCell,
  TableBody,
  TableHeader,
} from "../DiffTable";
import QuestObjectives from "../QuestObjectives";
import { sortBy } from "lodash";
import { DestinyInventoryItemDefinition } from "@destiny-definitions/common";

const CLASS_TYPE_NAME: { [k: string]: string } = {
  [1]: "Hunter",
  [2]: "Warlock",
  [0]: "Titan",
};

export default function InventoryItemDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
  otherDefinitions,
}: Omit<DiffListProps, "title">) {
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

  const isQuests = false;
  const isWeapon = false;
  const isArmor = false;

  const sortedHashes = sortBy(
    hashes,
    (hash) => definitions[hash]?.index ?? hash
  );

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
        {sortedHashes.map((hash) => {
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
                <ItemSummary definition={def} definitions={definitions} />
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

              {isWeapon && <Cell>weapon slot</Cell>}

              {isArmor && (
                <Cell>{def.classType && CLASS_TYPE_NAME[def.classType]}</Cell>
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
