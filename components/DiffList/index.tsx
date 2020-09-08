import { Fragment } from "react";

import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
  DiffGroup,
  ItemCategory,
  ItemCategoryValues,
} from "../../types";

import FallbackDiffList from "./Fallback";
import ObjectiveDiffList from "./Objective";
import InventoryItemDiffList from "./InventoryItem";

interface DiffListProps {
  name: string;
  hashes: DiffGroup | number[];
  definitions: AnyDefinitionTable;
  definitionName: string;
}
interface ForDefinitionTypeProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
  itemCategory?: string;
  definitionName: string;
}

function ForDefinitionType({
  itemCategory,
  hashes,
  definitions,
  definitionName,
}: ForDefinitionTypeProps) {
  const zeroth = hashes[0];
  const def = definitions[zeroth];

  switch (def?.__type) {
    case "DestinyObjectiveDefinition":
      return (
        <ObjectiveDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={definitions}
        />
      );
    case "DestinyInventoryItemDefinition":
      return (
        <InventoryItemDiffList
          definitionName={definitionName}
          itemCategory={itemCategory || ItemCategory.Other}
          hashes={hashes}
          definitions={definitions}
        />
      );
    default:
      return (
        <FallbackDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={definitions}
        />
      );
  }
}

const NO_CATEGORY = "NO_CATEGORY";

export default function DiffList({
  name,
  hashes,
  definitions,
  definitionName,
}: DiffListProps) {
  const groupedHashes = Array.isArray(hashes)
    ? { [NO_CATEGORY]: hashes }
    : hashes;

  const hasItems = Object.values(groupedHashes).some((v) => v.length);

  if (!hasItems) {
    return null;
  }

  const id = name.toLowerCase();

  const sortedGroups = Object.entries(groupedHashes).sort((a, b) => {
    return ItemCategoryValues.indexOf(a[0]) - ItemCategoryValues.indexOf(b[0]);
  });

  return (
    <div>
      <h3 id={id}>{name}</h3>

      {sortedGroups.map(([category, hashes]) => (
        <Fragment key={category}>
          {category !== NO_CATEGORY && (
            <h4 id={`${id}_${category}`}>{category}</h4>
          )}

          <ForDefinitionType
            definitionName={definitionName}
            hashes={hashes}
            definitions={definitions}
            itemCategory={category}
          />
        </Fragment>
      ))}
    </div>
  );
}
