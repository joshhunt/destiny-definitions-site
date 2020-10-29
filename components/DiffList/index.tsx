import React, { Fragment } from "react";

import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
  DiffGroup,
  ItemCategory,
  ItemCategoryValues,
  AllDestinyManifestComponentsTagged,
} from "../../types";

import FallbackDiffList from "./Fallback";
import ObjectiveDiffList from "./Objective";
import RecordDiffList from "./Record";
import CollectibleDiffList from "./Collectible";
import PresentationNodeDiffList from "./PresentationNode";
import InventoryItemDiffList from "./InventoryItem";

import s from "./styles.module.scss";
import { castDefinitions } from "../../lib/utils";
import ActivityDiffList from "./Activity";
import DestinationDiffList from "./Destination";
import VendorDiffList from "./Vendor";

interface DiffListProps {
  name: string;
  hashes: DiffGroup | number[];
  definitions: AnyDefinitionTable;
  definitionName: string;
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
  useFallback?: boolean;
}

interface ForDefinitionTypeProps {
  hashes: number[];
  definitions: AnyDefinitionTable;
  itemCategory?: string;
  definitionName: string;
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
  useFallback?: boolean;
}

function ForDefinitionType({
  itemCategory,
  hashes,
  definitions,
  definitionName,
  otherDefinitions,
  useFallback,
}: ForDefinitionTypeProps) {
  const zeroth = hashes[0];
  const def = definitions[zeroth];

  switch (useFallback ? "fallback" : def?.__type) {
    case "DestinyVendorDefinition":
      return (
        <VendorDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={castDefinitions(definitions, "DestinyVendorDefinition")}
          otherDefinitions={otherDefinitions}
        />
      );

    case "DestinyActivityDefinition":
      return (
        <ActivityDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={castDefinitions(
            definitions,
            "DestinyActivityDefinition"
          )}
          otherDefinitions={otherDefinitions}
        />
      );

    case "DestinyDestinationDefinition":
      return (
        <DestinationDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={castDefinitions(
            definitions,
            "DestinyDestinationDefinition"
          )}
          otherDefinitions={otherDefinitions}
        />
      );

    case "DestinyObjectiveDefinition":
      return (
        <ObjectiveDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={castDefinitions(
            definitions,
            "DestinyObjectiveDefinition"
          )}
        />
      );

    case "DestinyPresentationNodeDefinition":
      return (
        <PresentationNodeDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={castDefinitions(
            definitions,
            "DestinyPresentationNodeDefinition"
          )}
          otherDefinitions={otherDefinitions}
        />
      );

    case "DestinyRecordDefinition":
      return (
        <RecordDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={castDefinitions(definitions, "DestinyRecordDefinition")}
          otherDefinitions={otherDefinitions}
        />
      );

    case "DestinyCollectibleDefinition":
      return (
        <CollectibleDiffList
          definitionName={definitionName}
          hashes={hashes}
          definitions={castDefinitions(
            definitions,
            "DestinyCollectibleDefinition"
          )}
        />
      );

    case "DestinyInventoryItemDefinition":
      return (
        <InventoryItemDiffList
          definitionName={definitionName}
          itemCategory={itemCategory || ItemCategory.Other}
          hashes={hashes}
          definitions={castDefinitions(
            definitions,
            "DestinyInventoryItemDefinition"
          )}
          otherDefinitions={otherDefinitions}
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
  otherDefinitions,
  useFallback,
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
    <div className={s.diffListRoot}>
      <h3 id={id}>{name}</h3>

      {sortedGroups.map(([category, hashes]) => (
        <Fragment key={category}>
          {category !== NO_CATEGORY && (
            <h4 className={s.groupTitle} id={`${id}_${category}`}>
              {category}
            </h4>
          )}

          <ForDefinitionType
            definitionName={definitionName}
            hashes={hashes}
            definitions={definitions}
            itemCategory={category}
            otherDefinitions={otherDefinitions}
            useFallback={useFallback}
          />
        </Fragment>
      ))}
    </div>
  );
}
