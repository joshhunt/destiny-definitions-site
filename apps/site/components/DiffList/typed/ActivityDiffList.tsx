import React from "react";
import { castDefinitionsTable, getDisplayName } from "../../../lib/utils";
import BungieImage, { getBungieImageURL } from "../../BungieImage";
import Table, { Cell, TableBody, TableHeader, TableRow } from "../../DiffTable";
import { DiffHashLink } from "../../HashLink";
import Interpose from "../../Interpose";
import BaseCells, {
  BaseHeaderCells,
  getHasDisplayProperties,
} from "../BaseCells";

import s from "../styles.module.scss";
import { TypedDiffListProps } from "../types";

export default function ActivityDiffList({
  tableName,
  hashes,
  definitions: genericDefinitions,
  otherDefinitions,
}: TypedDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const definitions = castDefinitionsTable(
    "DestinyActivityDefinition",
    tableName,
    genericDefinitions
  );

  const {
    DestinyDestinationDefinition: destinationDefs = {},
    DestinyPlaceDefinition: placeDefs = {},
  } = otherDefinitions;

  const hasDisplayProperties = getHasDisplayProperties(hashes, definitions);
  const hasDestination = hashes.some(
    (hash) => destinationDefs[definitions[hash]?.destinationHash ?? 0]
  );
  const hasPlace = hashes.some(
    (hash) => placeDefs[definitions[hash]?.placeHash ?? 0]
  );
  const hasPgcrImage = hashes.some((hash) => definitions[hash]?.pgcrImage);

  return (
    <Table>
      <TableHeader>
        <BaseHeaderCells hasDisplayProperties={hasDisplayProperties} />
        <Cell>Matchmaking</Cell>
        {hasDestination && <Cell>Destination</Cell>}
        {hasPlace && <Cell>Place</Cell>}
        {hasPgcrImage && <Cell>PGCR Image</Cell>}
      </TableHeader>

      <TableBody>
        {hashes.map((hash) => {
          const definition = definitions[hash];
          const destinationDef = definition?.destinationHash
            ? destinationDefs[definition?.destinationHash]
            : null;
          const placeDef = definition?.placeHash
            ? placeDefs[definition?.placeHash]
            : null;

          return (
            <TableRow key={hash}>
              <BaseCells
                definition={definition}
                tableName={tableName}
                hasDisplayProperties={hasDisplayProperties}
              />

              {/* Matchmaking */}
              <Cell>
                <Interpose node={<br />}>
                  {definition.matchmaking?.isMatchmade && <>Matchmade</>}

                  <>Max {definition.matchmaking?.maxPlayers} players</>

                  <span className={s.nowrap}>
                    Party: {definition.matchmaking?.minParty} -{" "}
                    {definition.matchmaking?.maxParty} players
                  </span>
                </Interpose>
              </Cell>

              {/* Destination */}
              {hasDestination && (
                <Cell>
                  {destinationDef?.hash && (
                    <DiffHashLink
                      tableName="DestinyDestinationDefinition"
                      hash={destinationDef.hash}
                    >
                      {getDisplayName(destinationDef)}
                    </DiffHashLink>
                  )}
                </Cell>
              )}

              {/* Place */}
              {hasPlace && (
                <Cell>
                  {placeDef?.hash && (
                    <DiffHashLink
                      tableName="DestinyPlaceDefinition"
                      hash={placeDef?.hash}
                    >
                      {getDisplayName(placeDef)}
                    </DiffHashLink>
                  )}
                </Cell>
              )}

              {/* PGCR Image */}
              {hasPgcrImage && (
                <Cell>
                  {definition.pgcrImage && (
                    <a
                      href={getBungieImageURL(definition.pgcrImage)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BungieImage
                        className={s.screenshotPreview}
                        src={definition.pgcrImage}
                      />
                    </a>
                  )}
                </Cell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
