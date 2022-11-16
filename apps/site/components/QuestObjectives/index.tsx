import {
  DefinitionTable,
  DestinyObjectiveDefinition,
} from "@destiny-definitions/common";
import React from "react";
import s from "./styles.module.scss";

interface QuestObjectivesProps {
  objectiveDefinitions: DefinitionTable<DestinyObjectiveDefinition>;
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

        const isBoolean =
          (def.valueStyle === 0 || def.valueStyle === 2) &&
          def.completionValue === 1;

        const progressDescription =
          isBoolean && !def.progressDescription ? (
            <em>Completed</em>
          ) : (
            def.progressDescription
          );

        return (
          <div className={s.objective}>
            <div className={s.box} />

            <div className={s.track}>
              <div className={s.description}>{progressDescription}</div>
              {!isBoolean && (
                <div className={s.value}>{def.completionValue}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestObjectives;
