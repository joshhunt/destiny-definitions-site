import cx from "classnames";

import { getDescription, getDisplayName, getIconSrc } from "../../lib/utils";
import { AnyDefinitionTable, BareDestinyDefinition } from "../../types";
import BungieImage from "../BungieImage";
import HashLink from "../HashLink";

import s from "./styles.module.scss";

interface BaseDiffListProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
  definitionName: string;
  row: (def: any, hash: number) => [string, React.ReactNode][];
}

export default function BaseDiffList<T>({
  hashes,
  definitions,
  definitionName,
  row,
}: BaseDiffListProps) {
  const hasIcon = hashes.some((hash) => {
    const def = definitions[hash] as BareDestinyDefinition;
    return def?.displayProperties?.icon;
  });

  const hasName = hashes.some((hash) => getDisplayName(definitions[hash]));

  const hasDescription = hashes.some((hash) => {
    const def = definitions[hash] as BareDestinyDefinition;
    return def?.displayProperties?.description;
  });

  const otherHeaders = row(definitions[hashes[0]], hashes[0]).map((v) => v[0]);

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td className={s.shrink}>Hash</td>
          {hasIcon && <td>Icon</td>}
          {hasName && <td>Name</td>}
          {hasDescription && <td>Description</td>}
          {otherHeaders.map((header) => (
            <td>{header}</td>
          ))}
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];

          const otherCells = row(def, hash).map(([, cell], index) => (
            <td key={index}>{cell}</td>
          ));

          return (
            <tr key={hash}>
              <td className={s.shrink}>
                <HashLink hash={hash} definitionName={definitionName} />
              </td>
              {hasIcon && (
                <td className={s.shrink}>
                  <BungieImage className={s.icon} src={getIconSrc(def)} />
                </td>
              )}
              {hasName && <td className={s.nowrap}>{getDisplayName(def)}</td>}
              {hasDescription && (
                <td className={cx(s.prewrap)}>{getDescription(def)}</td>
              )}

              {otherCells}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
