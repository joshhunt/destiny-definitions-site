import React from "react";
import ActivityDiffList from "./ActivityDiffList";

import FallbackDiffList from "./Fallback";
import InventoryItemDiffList from "./InventoryItemDiffList/GroupedInventoryItemDiffList";

import s from "./styles.module.scss";
import { DiffListProps } from "./types";

function DiffListForType(props: Omit<DiffListProps, "title">) {
  if (props.tableName === "DestinyInventoryItemDefinition") {
    return <InventoryItemDiffList {...props} />;
  }

  if (props.tableName === "DestinyActivityDefinition") {
    return <ActivityDiffList {...props} />;
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
