import React from "react";
import {
  AllDestinyManifestComponentsTagged,
  DestinyObjectiveDefinitionTagged,
} from "../../types";
import BaseDiffList from "./BaseDiffList";

interface ObjectiveDiffListProps {
  definitionName: string;
  hashes: number[];
  definitions: AllDestinyManifestComponentsTagged["DestinyObjectiveDefinition"];
}

export default function ObjectiveDiffList({
  definitionName,
  hashes,
  definitions,
}: ObjectiveDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  return (
    <BaseDiffList
      definitionName={definitionName}
      hashes={hashes}
      definitions={definitions}
      row={(def?: DestinyObjectiveDefinitionTagged) => [
        ["Progress description", def?.progressDescription],
        ["Completion value", def?.completionValue],
      ]}
    />
  );
}
