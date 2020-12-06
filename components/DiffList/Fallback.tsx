import cx from "classnames";

import { getDescription, getDisplayName, getIconSrc } from "../../lib/utils";
import { AnyDefinitionTable, BareDestinyDefinition } from "../../types";
import BungieImage from "../BungieImage";
import HashLink from "../HashLink";

import s from "./styles.module.scss";

interface FallbackDiffListProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
  definitionName: string;
}

export default function FallbackDiffList({
  hashes,
  definitions,
  definitionName,
}: FallbackDiffListProps) {
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

  const hasDescription = hashes.some((hash) => {
    const def = definitions[hash] as BareDestinyDefinition;
    return def?.displayProperties?.description;
  });

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td className={s.shrink}>Hash</td>
          {hasIcon && <td>Icon</td>}
          {hasName && <td>Name</td>}
          {hasDescription && <td>Description</td>}
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];
          if (!def) {
            return (
              <tr key={hash}>
                <td className={s.shrink}>{hash}</td>
                <td colSpan={3}>Missing data</td>
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
                    className={s.icon}
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
              {hasDescription && (
                <td className={cx(s.mainColumn, s.prewrap)}>
                  {getDescription(def)}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
