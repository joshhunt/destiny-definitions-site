import cx from "classnames";
import Link from "next/link";
import React from "react";

import { getDisplayName, getIconSrc } from "../../lib/utils";
import { AnyDefinitionTable, BareDestinyDefinition } from "../../types";
import BungieImage from "../BungieImage";
import { useDiffData } from "../diffDataContext";
import HashLink from "../HashLink";
import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";
import config from "../../config";

interface ModifiedDiffListProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
  definitionName: string;
}

export default function ModifiedDiffList({
  hashes,
  definitions,
  definitionName,
}: ModifiedDiffListProps) {
  const { modifiedDeepDiffs, versionId } = useDiffData();

  if (hashes.length == 0) {
    return null;
  }

  const hasIcon = hashes.some((hash) => {
    const def = definitions[hash] as BareDestinyDefinition;
    return def?.displayProperties?.icon;
  });

  const hasName = hashes.some((hash) => {
    const def = definitions[hash];
    return getDisplayName(def);
  });

  return (
    <table className={s.table}>
      <thead className={s.tableHeader}>
        <tr>
          <td className={s.shrink}>Hash</td>
          {hasIcon && <td>Icon</td>}
          {hasName && <td>Name</td>}
          <td>Properties changed</td>
          {config.modifiedDiffPages && <td>Link</td>}
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];
          const modifiedDiffs = modifiedDeepDiffs[hash];

          if (!def) {
            return (
              <tr key={hash}>
                <td className={s.shrink}>{hash}</td>
                <td colSpan={2}>Missing data</td>
              </tr>
            );
          }

          return (
            <tr key={hash}>
              <td className={s.shrink}>
                <HashLink hash={hash} definitionName={definitionName} />
              </td>

              {hasIcon && (
                <td className={s.shrink}>
                  <BungieImage
                    className={s.smallIcon}
                    src={getIconSrc(def)}
                    alt={
                      hasName
                        ? `Icon of "${getDisplayName(def)}"`
                        : "Icon of this entity"
                    }
                  />
                </td>
              )}

              {hasName && <td className={s.nowrap}>{getDisplayName(def)}</td>}

              <td>{modifiedDiffs.diff.length}</td>

              {config.modifiedDiffPages && (
                <td>
                  <Link
                    href={`/version/${versionId}/${definitionName}/modified/${hash}`}
                  >
                    <a className={commonStyles.link}>View diff</a>
                  </Link>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
