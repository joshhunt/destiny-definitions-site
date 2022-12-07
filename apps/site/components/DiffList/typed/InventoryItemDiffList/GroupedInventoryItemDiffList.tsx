import React from "react";
import { TypedDiffListProps } from "../../types";
import { castDefinitionsTable } from "../../../../lib/utils";
import { groupHashes, ItemCategory } from "./categorise";
import InventoryItemDiffList from "./InventoryItemDiffList";

export default function GroupedInventoryItemDiffList({
  hashes,
  ...props
}: TypedDiffListProps) {
  const { tableName, definitions: genericDefinitions } = props;

  const isTruncated = hashes.length < props.fullHashCount;

  if (hashes.length == 0) {
    return null;
  }

  if (isTruncated) {
    return (
      <InventoryItemDiffList
        {...props}
        itemCategory={ItemCategory.Other}
        hashes={hashes}
      />
    );
  }

  const definitions = castDefinitionsTable(
    "DestinyInventoryItemDefinition",
    tableName,
    genericDefinitions
  );

  const groupedHashes = groupHashes(hashes, definitions);

  return (
    <>
      {groupedHashes.map(([groupName, groupHashes]) => {
        return (
          <div key={groupName}>
            <h4>{groupName}</h4>

            <InventoryItemDiffList
              {...props}
              itemCategory={groupName}
              hashes={groupHashes}
            />
          </div>
        );
      })}
    </>
  );
}
