import cx from "classnames";
import React from "react";
import { AllDestinyManifestComponentsTagged } from "../../types";
import BungieImage from "../BungieImage";
import HashLink from "../HashLink";
import QuestObjectives from "../QuestObjectives";

import s from "./styles.module.scss";

interface RecordDiffListProps {
  definitionName: string;
  hashes: number[];
  definitions: AllDestinyManifestComponentsTagged["DestinyRecordDefinition"];
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
}

export default function RecordDiffList({
  definitionName,
  hashes,
  definitions,
  otherDefinitions,
}: RecordDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  const { DestinyObjectiveDefinition: objectiveDefs } = otherDefinitions;

  if (!objectiveDefs) {
    throw new Error("Expected to have Objective definitions");
  }

  return (
    <table className={s.table}>
      <thead className={s.tableHeader}>
        <tr>
          <td>Hash</td>
          <td>Icon</td>
          <td>Name</td>
          <td>Description</td>
          <td>Objectives</td>
          <td>Points</td>
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];

          const objectives = [
            ...(def.objectiveHashes ?? []),
            ...(def.intervalInfo?.intervalObjectives ?? []).map(
              (v) => v.intervalObjectiveHash
            ),
          ];

          if (!def) {
            return (
              <tr key={hash}>
                <td>{hash}</td>
                <td colSpan={4}>Missing data</td>
              </tr>
            );
          }

          return (
            <tr key={hash}>
              <td className={s.shrink}>
                <HashLink hash={hash} definitionName={definitionName} />
              </td>

              <td className={s.shrink}>
                <BungieImage
                  className={s.icon}
                  src={def.displayProperties?.icon}
                  alt="Icon"
                />
              </td>

              <td className={s.nowrap}>{def.displayProperties?.name}</td>

              <td>{def.displayProperties?.name}</td>

              <td>
                <div className={s.objectives}>
                  <QuestObjectives
                    objectiveHashes={objectives}
                    objectiveDefinitions={objectiveDefs}
                  />
                </div>
              </td>

              <td className={cx(s.nowrap, s.shrink)}>
                {(def.intervalInfo?.intervalObjectives ?? []).length > 0 ? (
                  <table cellSpacing={0} cellPadding={0}>
                    <tbody>
                      {(def.intervalInfo?.intervalObjectives ?? []).map(
                        (v, index) => (
                          <tr key={index}>
                            {" "}
                            <td>{v.intervalScoreValue} pts</td>{" "}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <span>{def.completionInfo?.ScoreValue ?? 0} pts</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
