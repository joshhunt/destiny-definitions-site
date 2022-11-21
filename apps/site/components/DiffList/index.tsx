import React from "react";
import FallbackDiffList from "./Fallback";

import ActivityDiffList from "./typed/ActivityDiffList";
import CollectibleDiffList from "./typed/CollectibleDiffList";
import DestinationDiffList from "./typed/DestinationDiffList";
import PresentationNodeDiffList from "./typed/PresentationNodeDiffList";
import ObjectiveDiffList from "./typed/ObjectiveDiffList";
import RecordDiffList from "./typed/RecordDiffList";
import InventoryItemDiffList from "./typed/InventoryItemDiffList/GroupedInventoryItemDiffList";

import s from "./styles.module.scss";
import { DiffListProps } from "./types";

function DiffListForType(props: Omit<DiffListProps, "title">) {
  if (props.tableName === "DestinyInventoryItemDefinition") {
    return <InventoryItemDiffList {...props} />;
  }

  if (props.tableName === "DestinyActivityDefinition") {
    return <ActivityDiffList {...props} />;
  }

  if (props.tableName === "DestinyCollectibleDefinition") {
    return <CollectibleDiffList {...props} />;
  }

  if (props.tableName === "DestinyDestinationDefinition") {
    return <DestinationDiffList {...props} />;
  }

  if (props.tableName === "DestinyObjectiveDefinition") {
    return <ObjectiveDiffList {...props} />;
  }

  if (props.tableName === "DestinyPresentationNodeDefinition") {
    return <PresentationNodeDiffList {...props} />;
  }

  if (props.tableName === "DestinyRecordDefinition") {
    return <RecordDiffList {...props} />;
  }

  return <FallbackDiffList {...props} />;
}

export default function DiffList({ title, ...props }: DiffListProps) {
  if (props.hashes.length === 0) {
    return null;
  }

  return (
    <div className={s.diffListRoot}>
      <h3>{title}</h3>

      <DiffListForType {...props} />
    </div>
  );
}
