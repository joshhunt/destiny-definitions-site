import React, { Fragment } from "react";

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
import ModifiedDiffList from "./Modified";
import { GenericDefinitionTable } from "@destiny-definitions/common";

interface DiffListProps {
  title: string;
  tableName: string;
  hashes: number[];
  definitions: GenericDefinitionTable;
}

export default function DiffList({
  title,
  tableName,
  hashes,
  definitions,
}: DiffListProps) {
  if (hashes.length === 0) {
    return null;
  }

  return (
    <div className={s.diffListRoot}>
      <h3>{title}</h3>

      <FallbackDiffList
        tableName={tableName}
        hashes={hashes}
        definitions={definitions}
      />
    </div>
  );
}
