import React, { useMemo } from "react";
import {
  AllDestinyManifestComponentsTagged,
  DestinyObjectiveDefinitionTagged,
} from "../../types";
import InlineEntry from "../InlineEntry";
import BaseDiffList from "./BaseDiffList";

import s from "./styles.module.scss";

interface ObjectiveDiffListProps {
  definitionName: string;
  hashes: number[];
  definitions: AllDestinyManifestComponentsTagged["DestinyObjectiveDefinition"];
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
}

export default function ObjectiveDiffList({
  definitionName,
  hashes,
  definitions,
  otherDefinitions,
}: ObjectiveDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const itemDefs = useMemo(
    () => Object.values(otherDefinitions?.DestinyInventoryItemDefinition || {}),
    [otherDefinitions?.DestinyInventoryItemDefinition]
  );

  const metricDefs = useMemo(
    () => Object.values(otherDefinitions?.DestinyMetricDefinition || {}),
    [otherDefinitions?.DestinyMetricDefinition]
  );

  const recordDefs = useMemo(
    () => Object.values(otherDefinitions?.DestinyRecordDefinition || {}),
    [otherDefinitions?.DestinyRecordDefinition]
  );

  const activityDefs = useMemo(
    () => Object.values(otherDefinitions?.DestinyActivityDefinition || {}),
    [otherDefinitions?.DestinyActivityDefinition]
  );

  const presentationNodeDefs = useMemo(
    () =>
      Object.values(otherDefinitions?.DestinyPresentationNodeDefinition || {}),
    [otherDefinitions?.DestinyPresentationNodeDefinition]
  );

  return (
    <BaseDiffList
      suppressNameAndDescription={true}
      definitionName={definitionName}
      // hashes={hashes.filter((v) => v === 3835626566)}
      hashes={hashes}
      definitions={definitions}
      row={(def?: DestinyObjectiveDefinitionTagged) => {
        if (!def) return [];

        const hash = def.hash;
        const { name, description } = def.displayProperties ?? {};
        const progressDescription = def.progressDescription;

        const elements = [
          name && progressDescription !== name && (
            <div key={1} className={s.rowHeading}>
              {name}
            </div>
          ),
          description && <div key={2}>{description}</div>,
          progressDescription && progressDescription !== description && (
            <div key={3}>{progressDescription}</div>
          ),
        ];

        const onItems = itemDefs.filter((v) =>
          v.objectives?.objectiveHashes?.includes(hash)
        );

        const onMetrics = metricDefs.filter(
          (v) => v.trackingObjectiveHash === hash
        );

        const onRecords = recordDefs.filter(
          (v) =>
            v.objectiveHashes?.includes(hash) ||
            v.intervalInfo?.intervalObjectives?.some(
              (vv) => vv.intervalObjectiveHash === hash
            )
        );

        const onPresentationNodes = presentationNodeDefs.filter(
          (v) => v.objectiveHash === hash
        );

        const onActivities = activityDefs.filter((v) =>
          v.challenges?.some((vv) => vv.objectiveHash === hash)
        );

        const onAll = [
          ...onItems,
          ...onMetrics,
          ...onRecords,
          ...onActivities,
          ...onPresentationNodes,
        ];

        const foundIn = onAll.map((v) => (
          <div key={v.hash}>
            <InlineEntry definition={v} />
          </div>
        ));

        return [
          ["Objective", <>{elements}</>],
          ["Completion value", def.completionValue],
          ["Found in", <>{foundIn}</>],
        ];
      }}
    />
  );
}
