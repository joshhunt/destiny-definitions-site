import React from "react";
import { InteractionRewardSet, QuestVendor } from "./types";

import s from "./styles.module.scss";
import QuestObjectives from "../QuestObjectives";
import RewardItem from "../RewardItem";
import ItemHeader from "../ItemHeader";
import {
  DefinitionTable,
  DestinyInventoryItemDefinition,
  DestinyObjectiveDefinition,
} from "@destiny-definitions/common";
import { getDescription, getDisplayName } from "../../lib/utils";

export interface QuestPageProps {
  questHash: number;
  rewardItemHashes: number[];
  itemDefinitions: DefinitionTable<DestinyInventoryItemDefinition>;
  objectiveDefinitions: DefinitionTable<DestinyObjectiveDefinition>;
  relatedVendors: QuestVendor[];
  interactionRewards: InteractionRewardSet;
}

const QuestPage: React.FC<QuestPageProps> = ({
  questHash,
  rewardItemHashes,
  interactionRewards,
  itemDefinitions,
  relatedVendors,
  objectiveDefinitions,
}) => {
  const thisQuest = itemDefinitions[questHash];
  const questName =
    thisQuest?.setData?.questLineName ??
    thisQuest?.displayProperties?.name ??
    "";

  const allQuestDefs = (thisQuest?.setData?.itemList ?? [])
    .map((v) => itemDefinitions[v.itemHash ?? 0])
    .filter(Boolean);

  const relatedInteractions = relatedVendors.map((vendor) => ({
    vendor: vendor,
    interactions: vendor.interactions?.filter(
      (interaction) =>
        questName && interaction.headerDisplayProperties?.name === questName
    ),
  }));

  return (
    <div className={s.root}>
      <ItemHeader item={thisQuest} />

      <div className={s.grid}>
        {allQuestDefs.length > 0 && (
          <div>
            <h3>Steps</h3>

            {allQuestDefs.map((item, index) => (
              <div
                className={questHash === item.hash ? s.selectedStep : s.step}
              >
                <div className={s.stepHeader}>
                  <span className={s.stepHeaderText}>
                    <span className={s.stepNumber}>{index + 1}.</span>{" "}
                    {getDisplayName(item)}
                  </span>
                </div>

                <p>{getDescription(item)}</p>

                {item.displaySource && (
                  <p className={s.displaySource}>{item.displaySource}</p>
                )}

                <QuestObjectives
                  objectiveHashes={item.objectives?.objectiveHashes ?? []}
                  objectiveDefinitions={objectiveDefinitions}
                />
              </div>
            ))}
          </div>
        )}

        {relatedInteractions.length > 0 && (
          <div>
            <h3>Interactions</h3>

            {relatedInteractions.map(({ interactions, vendor }) => (
              <div className={s.interaction}>
                <div className={s.stepHeader}>{getDisplayName(vendor)}</div>

                {interactions?.map((interaction) => {
                  const itemHashes =
                    interactionRewards[vendor.hash ?? 0]?.[
                      interaction.interactionIndex ?? -1
                    ] ?? [];

                  const items = itemHashes
                    .map((v) => itemDefinitions[v])
                    .filter(Boolean);

                  return (
                    <blockquote className={s.interactionQuote}>
                      <p>{interaction.flavorLineOne}</p>

                      <div className={s.itemGrid}>
                        {items.map((item) => (
                          <RewardItem item={item} />
                        ))}
                      </div>
                    </blockquote>
                  );
                })}
              </div>
            ))}

            <p className={s.disclaimer}>
              Note: Vendor interactions are guesses, and are not guarenteed to
              be in the correct order.
            </p>
          </div>
        )}

        {rewardItemHashes.length > 0 && (
          <div>
            <h3>Related items &amp; rewards</h3>
            <div className={s.itemGrid}>
              {rewardItemHashes.map((itemHash) => (
                <RewardItem item={itemDefinitions[itemHash]} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestPage;
