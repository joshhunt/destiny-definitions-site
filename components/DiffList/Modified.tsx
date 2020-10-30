import cx from "classnames";

import { getDescription, getDisplayName, getIconSrc } from "../../lib/utils";
import { AnyDefinitionTable, BareDestinyDefinition } from "../../types";
import BungieImage from "../BungieImage";
import { useDiffData } from "../diffDataContext";
import HashLink from "../HashLink";

import s from "./styles.module.scss";

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
  const { modifiedDeepDiffs } = useDiffData();

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
      <thead>
        <tr>
          <td className={s.shrink}>Hash</td>
          {hasIcon && <td>Icon</td>}
          {hasName && <td>Name</td>}
          <td>Properties changed</td>
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
                  <BungieImage className={s.smallIcon} src={getIconSrc(def)} />
                </td>
              )}
              {hasName && <td className={s.nowrap}>{getDisplayName(def)}</td>}
              <td>{modifiedDiffs.diff.length}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
