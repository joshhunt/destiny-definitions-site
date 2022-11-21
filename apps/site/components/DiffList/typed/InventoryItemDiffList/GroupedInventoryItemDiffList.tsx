import React from "react";
import { TypedDiffListProps } from "../../types";
import { castDefinitionsTable } from "../../../../lib/utils";
import { groupHashes } from "./categorise";
import InventoryItemDiffList from "./InventoryItemDiffList";

export default function GroupedInventoryItemDiffList({
  version,
  tableName,
  hashes,
  definitions: genericDefinitions,
  otherDefinitions,
}: TypedDiffListProps) {
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
              version={version}
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
