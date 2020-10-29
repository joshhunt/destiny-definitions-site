import React from "react";
import {
  AllDestinyManifestComponentsTagged,
  DestinyVendorDefinitionTagged,
} from "../../types";
import BungieImage from "../BungieImage";
import BaseDiffList from "./BaseDiffList";

import s from "./styles.module.scss";

interface VendorDiffListProps {
  definitionName: string;
  hashes: number[];
  definitions: AllDestinyManifestComponentsTagged["DestinyVendorDefinition"];
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
}

export default function VendorDiffList({
  definitionName,
  hashes,
  definitions,
  otherDefinitions,
}: VendorDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const { DestinyDestinationDefinition: destinationDefs } = otherDefinitions;

  return (
    <BaseDiffList
      definitionName={definitionName}
      hashes={hashes}
      definitions={definitions}
      row={(def: DestinyVendorDefinitionTagged | null) => {
        return [
          [
            "Locations",
            def?.locations?.map((location) => {
              const destinationDef =
                destinationDefs?.[location.destinationHash];

              return (
                destinationDef && (
                  <div
                    key={location.destinationHash}
                    className={s.spaceBetweenAbove}
                  >
                    {location.backgroundImagePath && (
                      <a
                        href={`https://www.bungie.net${location.backgroundImagePath}`}
                        target="_blank"
                      >
                        <BungieImage
                          className={s.screenshotPreview}
                          src={location.backgroundImagePath}
                        />
                      </a>
                    )}
                    {destinationDef.displayProperties.name}
                  </div>
                )
              );
            }),
          ],
        ];
      }}
    />
  );
}
