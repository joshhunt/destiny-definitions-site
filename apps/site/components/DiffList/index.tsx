import React from "react";
import FallbackDiffList from "./Fallback";

import ActivityDiffList from "./typed/ActivityDiffList";
import CollectibleDiffList from "./typed/CollectibleDiffList";
import DestinationDiffList from "./typed/DestinationDiffList";
import PresentationNodeDiffList from "./typed/PresentationNodeDiffList";
import ObjectiveDiffList from "./typed/ObjectiveDiffList";
import RecordDiffList from "./typed/RecordDiffList";
import InventoryItemDiffList from "./typed/InventoryItemDiffList/GroupedInventoryItemDiffList";
import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";
import { DiffListProps } from "./types";
import Link from "next/link";
import RemovedDiffList from "./Removed";
import ModifiedDiffList from "./Modified";
import Aside from "../Aside";

function DiffListForType(props: DiffListProps) {
  const { diffTypeSlug, tableName } = props;

  switch (diffTypeSlug) {
    case "removed":
      return <RemovedDiffList {...props} />;

    case "reclassified":
      return <RemovedDiffList {...props} />;

    case "modified":
      return <ModifiedDiffList {...props} />;

    default:
      break;
  }

  switch (tableName) {
    case "DestinyInventoryItemDefinition":
      return <InventoryItemDiffList {...props} />;

    case "DestinyActivityDefinition":
      return <ActivityDiffList {...props} />;

    case "DestinyCollectibleDefinition":
      return <CollectibleDiffList {...props} />;

    case "DestinyDestinationDefinition":
      return <DestinationDiffList {...props} />;

    case "DestinyObjectiveDefinition":
      return <ObjectiveDiffList {...props} />;

    case "DestinyPresentationNodeDefinition":
      return <PresentationNodeDiffList {...props} />;

    case "DestinyRecordDefinition":
      return <RecordDiffList {...props} />;

    default:
      break;
  }

  return <FallbackDiffList {...props} />;
}

export default function DiffList(props: DiffListProps) {
  const {
    title,
    hashes,
    fullHashCount,
    tableName,
    version: { id },
    diffTypeSlug,
  } = props;

  if (props.hashes.length === 0) {
    return null;
  }

  return (
    <div className={s.diffListRoot}>
      <h3 id={diffTypeSlug}>{title}</h3>

      <DiffListForType {...props} />

      {hashes.length < fullHashCount && (
        <Aside>
          Showing first {hashes.length} definitions.{" "}
          <Link
            data-testid="truncation-link"
            className={commonStyles.link}
            href={`/version/${id}/${tableName}/${diffTypeSlug}`}
          >
            View all {fullHashCount}.
          </Link>
        </Aside>
      )}
    </div>
  );
}
