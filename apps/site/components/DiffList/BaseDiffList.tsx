import cx from "classnames";

import { getDescription, getDisplayName, getIconSrc } from "../../lib/utils";
import { AnyDefinitionTable, BareDestinyDefinition } from "../../types";
import BungieImage from "../BungieImage";
import Table, {
  Cell,
  SmallCell,
  TableBody,
  TableHeader,
  TableRow,
} from "../DiffTable";
import HashLink from "../HashLink";

import s from "./styles.module.scss";

interface BaseDiffListProps {
  hashes: number[];
  suppressNameAndDescription?: boolean;
  definitions: AnyDefinitionTable;
  definitionName: string;
  row: (def: any, hash: number) => [string, React.ReactNode][];
}

export default function BaseDiffList<T>({
  hashes,
  suppressNameAndDescription,
  definitions,
  definitionName,
  row,
}: BaseDiffListProps) {
  const hasIcon = hashes.some((hash) => {
    const def = definitions[hash] as BareDestinyDefinition;
    return def?.displayProperties?.icon;
  });

  const hasName =
    !suppressNameAndDescription &&
    hashes.some((hash) => getDisplayName(definitions[hash]));

  const hasDescription =
    !suppressNameAndDescription &&
    hashes.some((hash) => {
      const def = definitions[hash] as BareDestinyDefinition;
      return def?.displayProperties?.description;
    });

  const otherHeaders = row(definitions[hashes[0]], hashes[0]).map((v) => v[0]);

  return (
    <Table>
      <TableHeader>
        <SmallCell>Hash</SmallCell>
        {hasIcon && <Cell>Icon</Cell>}
        {hasName && <Cell>Name</Cell>}
        {hasDescription && <Cell>Description</Cell>}
        {otherHeaders.map((header) => (
          <Cell>{header}</Cell>
        ))}
      </TableHeader>

      <TableBody>
        {hashes.map((hash) => {
          const def = definitions[hash];

          const otherCells = row(def, hash).map(([, cell], index) => (
            <td key={index}>{cell}</td>
          ));

          return (
            <TableRow key={hash}>
              <td className={s.shrink}>
                <HashLink hash={hash} tableName={tableName} />
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
                <td className={cx(s.prewrap)}>{getDescription(def)}</td>
              )}

              {otherCells}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
