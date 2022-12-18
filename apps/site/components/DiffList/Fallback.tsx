import { DefinitionTable } from "@destiny-definitions/common";

import { getDescription, getDisplayName, getIconSrc } from "../../lib/utils";
import BungieImage from "../BungieImage";
import Table, {
  Cell,
  SmallCell,
  TableBody,
  TableHeader,
  TableRow,
} from "../DiffTable";
import HashLink from "../HashLink";
import BaseCells, {
  BaseHeaderCells,
  getHasDisplayProperties,
} from "./BaseCells";

import s from "./styles.module.scss";

interface FallbackDiffListProps {
  tableName: string;
  hashes: number[];
  definitions: DefinitionTable;
}

export default function FallbackDiffList({
  hashes,
  definitions,
  tableName,
}: FallbackDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const hasDisplayProperties = getHasDisplayProperties(hashes, definitions);

  return (
    <Table>
      <TableHeader>
        <BaseHeaderCells hasDisplayProperties={hasDisplayProperties} />
      </TableHeader>

      <TableBody>
        {hashes.map((hash) => {
          const def = definitions[hash];
          if (!def) {
            return (
              <TableRow key={hash}>
                <SmallCell>{hash} Missing data</SmallCell>
              </TableRow>
            );
          }

          return (
            <TableRow key={hash}>
              <BaseCells
                definition={def}
                tableName={tableName}
                hasDisplayProperties={hasDisplayProperties}
              />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
