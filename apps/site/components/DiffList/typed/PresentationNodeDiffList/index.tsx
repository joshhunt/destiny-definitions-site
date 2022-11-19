import React from "react";
import Table, {
  Cell,
  ProseCell,
  TableBody,
  TableHeader,
  TableRow,
} from "../../../DiffTable";

import { TypedDiffListProps } from "../../types";
import BaseCells, {
  BaseHeaderCells,
  getHasDisplayProperties,
} from "../../BaseCells";
import { castDefinitionsTable } from "../../../../lib/utils";
import { ChildrenList } from "./ChildrenList";

export default function PresentationNodeDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
  otherDefinitions,
}: TypedDiffListProps) {
  if (hashes.length == 0) return null;

  const definitions = castDefinitionsTable(
    "DestinyPresentationNodeDefinition",
    tableName,
    genericDefinitions
  );
  const hasDisplayProperties = getHasDisplayProperties(hashes, definitions);
  const hasChildren = hashes.some((hash) =>
    Object.values(definitions[hash].children ?? {}).some(
      (childHashes) => childHashes.length
    )
  );

  return (
    <Table>
      <TableHeader>
        <BaseHeaderCells hasDisplayProperties={hasDisplayProperties} />
        {hasChildren && <Cell>Children</Cell>}
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
              {hasChildren && (
                <ProseCell>
                  <ChildrenList
                    otherDefinitions={otherDefinitions}
                    presentationNodeDefinitions={definitions}
                    definition={definition}
                  />
                </ProseCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
