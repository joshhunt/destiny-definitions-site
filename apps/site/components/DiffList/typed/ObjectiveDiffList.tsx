import React from "react";
import Table, { Cell, TableBody, TableHeader, TableRow } from "../../DiffTable";

import { TypedDiffListProps } from "../types";
import BaseCells, {
  BaseHeaderCells,
  getHasDisplayProperties,
} from "../BaseCells";
import { castDefinitionsTable } from "../../../lib/utils";

export default function ObjectiveDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
}: TypedDiffListProps) {
  if (hashes.length == 0) return null;

  const definitions = castDefinitionsTable(
    "DestinyObjectiveDefinition",
    tableName,
    genericDefinitions
  );
  const hasDisplayProperties = getHasDisplayProperties(hashes, definitions);
  const hasProgressDescription = hashes.some(
    (v) => definitions[v]?.progressDescription
  );
  const hasCompletionValue = hashes.some((v) =>
    Object.hasOwn(definitions[v] ?? {}, "completionValue")
  );

  return (
    <Table>
      <TableHeader>
        <BaseHeaderCells hasDisplayProperties={hasDisplayProperties} />
        {hasProgressDescription && <Cell>Objective</Cell>}
        {hasCompletionValue && <Cell>Completion value</Cell>}
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

              {hasCompletionValue && (
                <Cell>{definition.progressDescription}</Cell>
              )}
              {hasCompletionValue && <Cell>{definition.completionValue}</Cell>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
