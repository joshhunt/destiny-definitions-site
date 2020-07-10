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

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td>Hash</td>
          <td>Icon</td>
          <td>Name</td>
          <td>Description</td>
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
              <td>
                <BungieImage className={s.icon} src={getIconSrc(def)} />
              </td>
              <td>{getDisplayName(def)}</td>
              <td className={cx(s.mainColumn, s.prewrap)}>
                {getDescription(def)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
