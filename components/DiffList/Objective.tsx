import cx from "classnames";
import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
} from "../../types";
import BungieImage from "../BungieImage";

import s from "./styles.module.scss";
import { DestinyObjectiveDefinition } from "bungie-api-ts/destiny2";

interface ObjectiveDiffListProps {
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

export default function ObjectiveDiffList({
  hashes,
  definitions,
}: ObjectiveDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td>Hash</td>
          <td>Progress description</td>
          <td>Target</td>
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash] as DestinyObjectiveDefinition | null;

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
              <td className={s.nowrap}>{def.progressDescription}</td>
              <td className={cx(s.mainColumn, s.prewrap)}>
                {def.completionValue}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
