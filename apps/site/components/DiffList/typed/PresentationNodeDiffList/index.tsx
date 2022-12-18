import React from "react";
import Table, {
  Cell,
  ProseCell,
  TableBody,
  TableHeader,
  TableRow,
} from "../../../DiffTable";

import { TypedDiffListProps } from "../../types";
import s from "../../styles.module.scss";
import BaseCells, {
  BaseHeaderCells,
  getHasDisplayProperties,
} from "../../BaseCells";
import { castDefinitionsTable, getDisplayName } from "../../../../lib/utils";
import { ChildrenList } from "./ChildrenList";
import InlineEntry from "../../../InlineEntry";

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
  const { DestinyPresentationNodeDefinition: presentationNodeDefs = {} } =
    otherDefinitions;

  const hasDisplayProperties = getHasDisplayProperties(hashes, definitions);
  const hasChildren = hashes.some((hash) =>
    Object.values(definitions[hash].children ?? {}).some(
      (childHashes) => childHashes.length
    )
  );
  const hasParents = hashes.some((hash) =>
    definitions[hash]?.parentNodeHashes?.some(
      (parentHash) => presentationNodeDefs[parentHash]
    )
  );

  return (
    <Table>
      <TableHeader>
        <BaseHeaderCells hasDisplayProperties={hasDisplayProperties} />
        {hasChildren && <Cell>Children</Cell>}
        {hasParents && <Cell>Parents</Cell>}
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
                    definition={definition}
                  />
                </ProseCell>
              )}

              {hasParents && (
                <Cell>
                  <ul className={s.childList}>
                    {definition.parentNodeHashes?.map((parentHash) => {
                      const parentDef = presentationNodeDefs[parentHash];
                      return (
                        <li className={s.childItem} key={parentHash}>
                          <InlineEntry definition={parentDef} />
                        </li>
                      );
                    })}
                  </ul>
                </Cell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
