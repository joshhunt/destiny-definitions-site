import {
  DefinitionTable,
  GenericDefinition,
} from "@destiny-definitions/common";
import { getDescription, getDisplayName, getIconSrc } from "../../lib/utils";
import BungieImage from "../BungieImage";
import { Cell, NoWrapCell, ProseCell, SmallCell } from "../DiffTable";
import HashLink from "../HashLink";
import s from "./styles.module.scss";

interface BaseCellsProps {
  definition: GenericDefinition;
  tableName: string;
  hasDisplayProperties: HasDisplayProperties;
}

interface BaseHeaderCellsProps {
  hasDisplayProperties: HasDisplayProperties;
}

export function BaseHeaderCells({
  hasDisplayProperties,
}: BaseHeaderCellsProps) {
  return (
    <>
      <SmallCell>Hash</SmallCell>
      {hasDisplayProperties.icon && <Cell>Icon</Cell>}
      {hasDisplayProperties.name && <Cell>Name</Cell>}
      {hasDisplayProperties.description && <Cell>Description</Cell>}
    </>
  );
}

export default function BaseCells({
  tableName,
  definition,
  hasDisplayProperties,
}: BaseCellsProps) {
  return (
    <>
      <SmallCell>
        <HashLink hash={definition.hash} tableName={tableName} />
      </SmallCell>

      {hasDisplayProperties.icon && (
        <SmallCell>
          <BungieImage className={s.icon} src={getIconSrc(definition)} />
        </SmallCell>
      )}

      {hasDisplayProperties.name && (
        <NoWrapCell>{getDisplayName(definition)}</NoWrapCell>
      )}

      {hasDisplayProperties.description && (
        <ProseCell>{getDescription(definition)}</ProseCell>
      )}
    </>
  );
}

interface HasDisplayProperties {
  icon: boolean;
  name: boolean;
  description: boolean;
}

export function getHasDisplayProperties(
  hashes: number[],
  definitions: DefinitionTable
): HasDisplayProperties {
  return {
    icon: hashes.some((hash) => getIconSrc(definitions[hash])),
    name: hashes.some((hash) => getDisplayName(definitions[hash])),
    description: hashes.some((hash) => getDescription(definitions[hash])),
  };
}
