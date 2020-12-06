import React from "react";
import {
  AllDestinyManifestComponentsTagged,
  DestinyActivityDefinitionTagged,
} from "../../types";
import BungieImage from "../BungieImage";
import { DiffHashLink } from "../HashLink";
import Interpose from "../Interpose";
import BaseDiffList from "./BaseDiffList";

import s from "./styles.module.scss";

interface ActivityDiffListProps {
  definitionName: string;
  hashes: number[];
  definitions: AllDestinyManifestComponentsTagged["DestinyActivityDefinition"];
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
}

export default function ActivityDiffList({
  definitionName,
  hashes,
  definitions,
  otherDefinitions,
}: ActivityDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const {
    DestinyDestinationDefinition: destinationDefs,
    DestinyPlaceDefinition: placeDefs,
  } = otherDefinitions;

  return (
    <BaseDiffList
      definitionName={definitionName}
      hashes={hashes}
      definitions={definitions}
      row={(def: DestinyActivityDefinitionTagged | null) => {
        const destinationDef = def?.destinationHash
          ? destinationDefs?.[def?.destinationHash]
          : null;

        const placeDef = def?.placeHash ? placeDefs?.[def?.placeHash] : null;

        return [
          [
            "Matchmaking",
            def && (
              <Interpose node={<br />}>
                {def.matchmaking?.isMatchmade && <>Matchmade</>}

                <>Max {def.matchmaking?.maxPlayers} players</>

                <span className={s.nowrap}>
                  Party: {def.matchmaking?.minParty} -{" "}
                  {def.matchmaking?.maxParty} players
                </span>
              </Interpose>
            ),
          ],
          [
            "Destination",
            destinationDef && (
              <DiffHashLink
                definitionName="DestinyDestinationDefinition"
                hash={destinationDef.hash}
              >
                {destinationDef.displayProperties.name}
              </DiffHashLink>
            ),
          ],
          [
            "Place",
            placeDef && (
              <DiffHashLink
                definitionName="DestinyPlaceDefinition"
                hash={placeDef.hash}
              >
                {placeDef.displayProperties.name}
              </DiffHashLink>
            ),
          ],
          [
            "PGCR Image",
            def?.pgcrImage && (
              <a
                href={`https://www.bungie.net${def.pgcrImage}`}
                target="_blank"
              >
                <BungieImage
                  className={s.screenshotPreview}
                  src={def.pgcrImage}
                  alt="Icon for this activity"
                />
              </a>
            ),
          ],
        ];
      }}
    />
  );
}
