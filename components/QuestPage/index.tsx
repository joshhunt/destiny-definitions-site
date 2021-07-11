import React from "react";
import { DefsObject } from "../../types";
import {
  InteractionRewardSet,
  QuestItem,
  QuestObjective,
  QuestVendor,
} from "./types";

import s from "./styles.module.scss";
import QuestObjectives from "../QuestObjectives";
import BungieImage from "../BungieImage";
import RewardItem from "../RewardItem";

export interface QuestPageProps {
  questHash: number;
  rewardItemHashes: number[];
  itemDefinitions: DefsObject<QuestItem>;
  objectiveDefinitions: DefsObject<QuestObjective>;
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

  const allQuestDefs =
    thisQuest.setData?.itemList.map((v) => itemDefinitions[v.itemHash]) ?? [];

  const relatedInteractions = relatedVendors.map((vendor) => ({
    vendor: vendor,
    interactions: vendor.interactions.filter(
      (interaction) =>
        questName && interaction.headerDisplayProperties.name === questName
    ),
  }));

  return (
    <div className={s.root}>
      <h2 className={s.headerWithIcon}>
        <BungieImage
          className={s.icon}
          src={thisQuest.displayProperties.icon}
        />{" "}
        <span>{questName}</span>
      </h2>

      <div className={s.grid}>
        <div>
          <h3>Steps</h3>

          {allQuestDefs.map((item, index) => (
            <div className={s.step}>
              <div className={s.stepHeader}>
                <span className={s.stepNumber}>{index + 1}.</span>{" "}
                {item.displayProperties.name}
              </div>

              <p>{item.displayProperties.description}</p>

              <QuestObjectives
                objectiveHashes={item.objectives?.objectiveHashes ?? []}
                objectiveDefinitions={objectiveDefinitions}
              />
            </div>
          ))}
        </div>

        <div>
          <h3>Interactions</h3>

          {relatedInteractions.map(({ interactions, vendor }) => (
            <div>
              <div className={s.stepHeader}>
                {vendor.displayProperties.name}
              </div>
              {interactions.map((interaction) => {
                const itemHashes =
                  interactionRewards[vendor.hash]?.[
                    interaction.interactionIndex
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
            Note: Vendor interactions are guesses, and are not guarenteed to be
            in the correct order.
          </p>
        </div>

        {rewardItemHashes.length > 1 && (
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
