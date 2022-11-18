import React from "react";
import { DiffListProps } from "../types";
import { castDefinitionsTable } from "../../../lib/utils";
import { groupHashes } from "./categorise";
import InventoryItemDiffList from "./InventoryItemDiffList";

export default function GroupedInventoryItemDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
  otherDefinitions,
}: Omit<DiffListProps, "title">) {
  if (hashes.length == 0) {
    return null;
  }

  const definitions = castDefinitionsTable(
    "DestinyInventoryItemDefinition",
    tableName,
    genericDefinitions
  );

  const groupedHashes = groupHashes(hashes, definitions);

  return (
    <>
      {groupedHashes.map(([groupName, hashes]) => {
        return (
          <div key={groupName}>
            <h4>{groupName}</h4>
            <InventoryItemDiffList
              hashes={hashes}
              tableName={tableName}
              definitions={definitions}
              otherDefinitions={otherDefinitions}
              itemCategory={groupName}
            />
          </div>
        );
      })}
    </>
  );
}
