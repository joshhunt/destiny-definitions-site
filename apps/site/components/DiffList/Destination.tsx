import React from "react";
import {
  AllDestinyManifestComponentsTagged,
  DestinyDestinationDefinitionTagged,
} from "../../types";
import BaseDiffList from "./BaseDiffList";

import s from "./styles.module.scss";

interface DestinationDiffListProps {
  definitionName: string;
  hashes: number[];
  definitions: AllDestinyManifestComponentsTagged["DestinyDestinationDefinition"];
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
}

export default function DestinationDiffList({
  definitionName,
  hashes,
  definitions,
  otherDefinitions,
}: DestinationDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }
  const { DestinyPlaceDefinition: placeDefs } = otherDefinitions;

  return (
    <BaseDiffList
      definitionName={definitionName}
      hashes={hashes}
      definitions={definitions}
      row={(def: DestinyDestinationDefinitionTagged | null) => {
        const placeDef = def?.placeHash ? placeDefs?.[def?.placeHash] : null;

        return [
          ["Place", placeDef?.displayProperties.name],
          [
            "Bubbles",
            def && def.bubbleSettings.length > 0 && (
              <ul className={s.inlineList}>
                {def.bubbleSettings.map((bubble) => (
                  <li>{bubble.displayProperties.name}</li>
                ))}
              </ul>
            ),
          ],
        ];
      }}
    />
  );
}
