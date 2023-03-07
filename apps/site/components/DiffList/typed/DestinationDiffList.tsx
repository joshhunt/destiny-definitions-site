import React from "react";
import Table, { Cell, TableBody, TableHeader, TableRow } from "../../DiffTable";

import { TypedDiffListProps } from "../types";
import BaseCells, {
  BaseHeaderCells,
  getHasDisplayProperties,
} from "../BaseCells";
import { castDefinitionsTable, getDisplayName } from "../../../lib/utils";

export default function DestinationDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
  otherDefinitions,
}: TypedDiffListProps) {
  if (hashes.length == 0) return null;

  const definitions = castDefinitionsTable(
    "DestinyDestinationDefinition",
    tableName,
    genericDefinitions
  );
  const { DestinyPlaceDefinition: placeDefs = {} } = otherDefinitions;

  const hasDisplayProperties = getHasDisplayProperties(hashes, definitions);
  const hasPlace = hashes.some((v) => placeDefs[definitions[v]?.placeHash]);
  const hasBubbles = hashes.some(
    (v) => definitions[v]?.bubbleSettings?.length > 0
  );

  return (
    <Table>
      <TableHeader>
        <BaseHeaderCells hasDisplayProperties={hasDisplayProperties} />
        {hasPlace && <Cell>Place</Cell>}
        {hasBubbles && <Cell>Bubbles</Cell>}
      </TableHeader>

      <TableBody>
        {hashes.map((hash) => {
          const definition = definitions[hash];
          const placeDef = placeDefs[definition?.placeHash];

          return (
            <TableRow key={hash}>
              <BaseCells
                definition={definition}
                tableName={tableName}
                hasDisplayProperties={hasDisplayProperties}
              />

              {hasPlace && <Cell>{getDisplayName(placeDef)}</Cell>}
              {hasBubbles && (
                <Cell>
                  {definition.bubbleSettings?.length > 0 && (
                    <ul>
                      {definition.bubbleSettings.map((bubble) => (
                        <li>{getDisplayName(bubble)}</li>
                      ))}
                    </ul>
                  )}
                </Cell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
