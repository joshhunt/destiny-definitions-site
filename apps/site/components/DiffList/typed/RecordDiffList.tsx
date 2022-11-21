import {
  DefinitionTable,
  DestinyObjectiveDefinition,
  DestinyRecordDefinition,
} from "@destiny-definitions/common";
import React from "react";
import { castDefinitionsTable, getDisplayName } from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import Table, {
  Cell,
  ProseCell,
  TableBody,
  TableHeader,
  TableRow,
} from "../../DiffTable";
import { DiffHashLink } from "../../HashLink";
import Interpose from "../../Interpose";
import QuestObjectives from "../../QuestObjectives";
import BaseCells, {
  BaseHeaderCells,
  getHasDisplayProperties,
} from "../BaseCells";

import s from "../styles.module.scss";
import { TypedDiffListProps } from "../types";

export default function RecordDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
  otherDefinitions,
}: TypedDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const definitions = castDefinitionsTable(
    "DestinyRecordDefinition",
    tableName,
    genericDefinitions
  );

  const { DestinyObjectiveDefinition: objectiveDefs = {} } = otherDefinitions;

  const hasDisplayProperties = getHasDisplayProperties(hashes, definitions);

  return (
    <Table>
      <TableHeader>
        <BaseHeaderCells hasDisplayProperties={hasDisplayProperties} />
        <Cell>Objectives</Cell>
        <Cell>Points</Cell>
      </TableHeader>

      <TableBody>
        {hashes.map((hash) => {
          const definition = definitions[hash];

          return (
            <TableRow key={hash}>
              <BaseCells
                definition={definition}
                tableName={tableName}
                hasDisplayProperties={hasDisplayProperties}
              />

              <RecordCells
                definition={definition}
                objectiveDefinitions={objectiveDefs}
              />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

interface RecordCellsProps {
  definition: DestinyRecordDefinition;
  objectiveDefinitions: DefinitionTable<DestinyObjectiveDefinition>;
}

function RecordCells({ definition, objectiveDefinitions }: RecordCellsProps) {
  let points: number[];
  let objectiveHashes: number[];

  if (definition.intervalInfo?.intervalObjectives?.length) {
    points =
      definition.intervalInfo.intervalObjectives?.map(
        (v) => v.intervalScoreValue ?? 0
      ) ?? [];

    objectiveHashes =
      definition.intervalInfo.intervalObjectives?.map(
        (v) => v.intervalObjectiveHash ?? 0
      ) ?? [];
  } else {
    points = [definition.completionInfo?.ScoreValue ?? 0];
    objectiveHashes = definition.objectiveHashes ?? [];
  }

  return (
    <>
      <ProseCell>
        <QuestObjectives
          objectiveHashes={objectiveHashes}
          objectiveDefinitions={objectiveDefinitions}
        />
      </ProseCell>

      <ProseCell>
        <table cellSpacing={0} cellPadding={0}>
          <tbody>
            {points.map((points, index) => (
              <tr key={index}>
                <td>{points} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ProseCell>
    </>
  );
}
