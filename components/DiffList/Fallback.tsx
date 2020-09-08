import cx from "classnames";
import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
} from "../../types";
import BungieImage from "../BungieImage";

import s from "./styles.module.scss";

interface FallbackDiffListProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
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
          <td>Hash</td>
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
              <tr>
                <td>{hash}</td>
                <td colSpan={3}>Missing data</td>
              </tr>
            );
          }

          return (
            <tr>
              <td>{hash}</td>
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
