import React from "react";
import Table, { Cell, TableBody, TableHeader, TableRow } from "../../DiffTable";

import { TypedDiffListProps } from "../types";
import BaseCells, {
  BaseHeaderCells,
  getHasDisplayProperties,
} from "../BaseCells";
import { castDefinitionsTable } from "../../../lib/utils";

export default function CollectibleDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
}: TypedDiffListProps) {
  if (hashes.length == 0) return null;

  const definitions = castDefinitionsTable(
    "DestinyCollectibleDefinition",
    tableName,
    genericDefinitions
  );
  const hasDisplayProperties = getHasDisplayProperties(hashes, definitions);
  const hasSource = hashes.some((v) => definitions[v]?.sourceString);

  return (
    <Table>
      <TableHeader>
        <BaseHeaderCells hasDisplayProperties={hasDisplayProperties} />
        {hasSource && <Cell>Source</Cell>}
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

              {/* sourceString */}
              {hasSource && <Cell>{definition.sourceString}</Cell>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
