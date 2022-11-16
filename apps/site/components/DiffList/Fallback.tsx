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

  const hasIcon = hashes.some((hash) => {
    const def = definitions[hash];
    return def?.displayProperties?.icon;
  });

  const hasName = hashes.some((hash) => {
    const def = definitions[hash];
    return getDisplayName(def);
  });

  const hasDescription = hashes.some((hash) => {
    const def = definitions[hash];
    return def?.displayProperties?.description;
  });

  return (
    <Table>
      <TableHeader>
        <SmallCell>Hash</SmallCell>
        {hasIcon && <Cell>Icon</Cell>}
        {hasName && <Cell>Name</Cell>}
        {hasDescription && <Cell>Description</Cell>}
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
              <SmallCell>
                <HashLink hash={hash} tableName={tableName} />
              </SmallCell>

              {hasIcon && (
                <SmallCell>
                  <BungieImage
                    className={s.icon}
                    src={getIconSrc(def)}
                    alt={
                      hasName
                        ? `Icon of "${getDisplayName(def)}"`
                        : "Icon of this entity"
                    }
                  />
                </SmallCell>
              )}

              {hasName && <td className={s.nowrap}>{getDisplayName(def)}</td>}

              {hasDescription && <Cell>{getDescription(def)}</Cell>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
