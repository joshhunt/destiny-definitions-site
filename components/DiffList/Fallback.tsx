import cx from "classnames";
import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
} from "../../types";
import BungieImage from "../BungieImage";

import s from "./styles.module.scss";
import HashLink from "../HashLink";

interface FallbackDiffListProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
  definitionName: string;
}

function getDisplayName(def: AnyDefinition & BareDestinyDefinition) {
  return def?.displayProperties?.name;
}

function getIconSrc(def: AnyDefinition & BareDestinyDefinition) {
  return def?.displayProperties?.icon;
}

function getDescription(def: AnyDefinition & BareDestinyDefinition) {
  return def?.displayProperties?.description;
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
                <td>
                  <BungieImage className={s.icon} src={getIconSrc(def)} />
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
