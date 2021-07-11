import React from "react";
import { DefsObject } from "../../types";
import { QuestItem, QuestObjective, QuestVendor } from "./types";

import s from "./styles.module.scss";
import QuestObjectives from "../QuestObjectives";
import BungieImage from "../BungieImage";

export interface QuestPageProps {
  questHash: number;
  rewardItemHashes: number[];
  itemDefinitions: DefsObject<QuestItem>;
  objectiveDefinitions: DefsObject<QuestObjective>;
  relatedVendors: QuestVendor[];
}

const QuestPage: React.FC<QuestPageProps> = ({
  questHash,
  rewardItemHashes,
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
              {interactions.map((interaction) => (
                <blockquote className={s.interactionQuote}>
                  {interaction.flavorLineOne}
                </blockquote>
              ))}
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
              {rewardItemHashes.map((itemHash) => {
                const reward = itemDefinitions[itemHash];

                return (
                  <div className={s.questItem}>
                    {" "}
                    <BungieImage
                      className={s.questIcon}
                      src={reward.displayProperties.icon}
                    />{" "}
                    <span className={s.questItemName}>
                      {reward.displayProperties.name}
                    </span>
                    <span className={s.questItemType}>
                      {reward.itemTypeAndTierDisplayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestPage;
