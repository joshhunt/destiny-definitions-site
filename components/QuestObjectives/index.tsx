import React from "react";
import { DefsObject } from "../../types";
import { QuestObjective } from "../QuestPage/types";
import s from "./styles.module.scss";

interface QuestObjectivesProps {
  objectiveDefinitions: DefsObject<QuestObjective>;
  objectiveHashes: number[];
}

const QuestObjectives: React.FC<QuestObjectivesProps> = ({
  objectiveHashes,
  objectiveDefinitions,
}) => {
  return (
    <div>
      {objectiveHashes.map((hash) => {
        const def = objectiveDefinitions[hash];

        if (!def) {
          return (
            <div>
              <em>Missing data</em>
            </div>
          );
        }

        return (
          <div className={s.objective}>
            <div className={s.box} />

            <div className={s.track}>
              <div className={s.description}>{def.progressDescription}</div>
              <div className={s.value}>{def.completionValue}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestObjectives;
