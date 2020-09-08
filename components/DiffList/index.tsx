import { Fragment } from "react";

import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
  DiffGroup,
  ItemCategory,
} from "../../types";

import FallbackDiffList from "./Fallback";
import ObjectiveDiffList from "./Objective";
import InventoryItemDiffList from "./InventoryItem";

interface DiffListProps {
  name: string;
  hashes: DiffGroup | number[];
  definitions: AnyDefinitionTable;
}
interface ForDefinitionTypeProps {
  name: string;
  hashes: number[];
  definitions: AnyDefinitionTable;
  itemCategory?: string;
}

function ForDefinitionType({
  name,
  itemCategory,
  hashes,
  definitions,
}: ForDefinitionTypeProps) {
  const zeroth = hashes[0];
  const def = definitions[zeroth];

  switch (def?.__type) {
    case "DestinyObjectiveDefinition":
      return <ObjectiveDiffList hashes={hashes} definitions={definitions} />;
    case "DestinyInventoryItemDefinition":
      return (
        <InventoryItemDiffList
          itemCategory={itemCategory || ItemCategory.Other}
          hashes={hashes}
          definitions={definitions}
        />
      );
    default:
      return <FallbackDiffList hashes={hashes} definitions={definitions} />;
  }
}

const NO_CATEGORY = "NO_CATEGORY";

export default function DiffList({ name, hashes, definitions }: DiffListProps) {
  const groupedHashes = Array.isArray(hashes)
    ? { [NO_CATEGORY]: hashes }
    : hashes;

  const hasItems = Object.values(groupedHashes).some((v) => v.length);

  if (!hasItems) {
    return null;
  }

  const id = name.toLowerCase();

  return (
    <div>
      <h3 id={id}>{name}</h3>

      {Object.entries(groupedHashes).map(([category, hashes]) => (
        <Fragment key={category}>
          {category !== NO_CATEGORY && (
            <h4 id={`${id}_${category}`}>{category}</h4>
          )}

          <ForDefinitionType
            name={name}
            hashes={hashes}
            definitions={definitions}
            itemCategory={category}
          />
        </Fragment>
      ))}
    </div>
  );
}
