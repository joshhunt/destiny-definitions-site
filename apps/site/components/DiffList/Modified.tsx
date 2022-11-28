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

interface ModifiedDiffListProps extends DiffListProps {
  version: ManifestVersion;
}

export default function ModifiedDiffList({
  title,
  version,
  hashes,
  definitions,
  tableName,
  fullHashCount,
  diffTypeSlug,
  version: { id },
}: ModifiedDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const hasName = hashes.some((hash) => getDisplayName(definitions[hash]));
  const hasIcon = hashes.some((hash) => getIconSrc(definitions[hash]));

  return (
    <div className={s.diffListRoot}>
      <h3>{title}</h3>

      <Table>
        <TableHeader>
          <SmallCell>Hash</SmallCell>
          {hasIcon && <SmallCell>Icon</SmallCell>}
          {hasName && <Cell>Name</Cell>}
          <Cell>Link</Cell>
        </TableHeader>

        <TableBody>
          {hashes.map((hash) => {
            const def = definitions[hash];

            if (!def) {
              return (
                <tr key={hash}>
                  <td className={s.shrink}>{hash}</td>
                  <td colSpan={2}>Missing data</td>
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
                    <BungieImage
                      className={s.smallIcon}
                      src={getIconSrc(def)}
                      alt={
                        hasName
                          ? `Icon of "${getDisplayName(def)}"`
                          : "Icon of this entity"
                      }
                    />
                  </SmallCell>
                )}

                {hasName && <Cell>{getDisplayName(def)}</Cell>}

                <Cell>
                  <Link
                    prefetch={false}
                    className={commonStyles.link}
                    href={`/version/${version.id}/${tableName}/modified/${hash}`}
                  >
                    View diff
                  </Link>
                </Cell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {hashes.length < fullHashCount && (
        <p>
          <em>
            Showing first {hashes.length} definitions.{" "}
            <Link
              className={commonStyles.link}
              href={`/version/${id}/${tableName}/${diffTypeSlug}`}
            >
              View all {fullHashCount}.
            </Link>
          </em>
        </p>
      )}
    </div>
  );
}
