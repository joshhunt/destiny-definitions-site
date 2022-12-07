import Link from "next/link";
import React from "react";

import { getDisplayName, getIconSrc } from "../../lib/utils";
import BungieImage from "../BungieImage";
import HashLink from "../HashLink";
import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";
import { DiffListProps } from "./types";
import { ManifestVersion } from "@destiny-definitions/common";
import Table, {
  Cell,
  SmallCell,
  TableBody,
  TableHeader,
  TableRow,
} from "../DiffTable";

export default function RemovedDiffList({
  hashes,
  definitions,
  tableName,
}: DiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const hasName = hashes.some((hash) => getDisplayName(definitions[hash]));
  const hasIcon = hashes.some((hash) => getIconSrc(definitions[hash]));

  return (
    <Table>
      <TableHeader>
        <SmallCell>Hash</SmallCell>
        {hasIcon && <SmallCell>Icon</SmallCell>}
        {hasName && <Cell>Name</Cell>}
      </TableHeader>

      <TableBody>
        {hashes.map((hash) => {
          const def = definitions[hash];

          if (!def) {
            return (
              <tr key={hash}>
                <td className={s.shrink}>{hash} Missing data</td>
              </tr>
            );
          }

          return (
            <TableRow key={hash}>
              <SmallCell>
                <HashLink hash={hash} tableName={tableName} />
              </SmallCell>

              {hasIcon && (
                <SmallCell>
                  <BungieImage className={s.smallIcon} src={getIconSrc(def)} />
                </SmallCell>
              )}

              {hasName && <Cell>{getDisplayName(def)}</Cell>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
