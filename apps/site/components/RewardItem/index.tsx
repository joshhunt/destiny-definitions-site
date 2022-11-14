import React from "react";
import BungieImage from "../BungieImage";
import { QuestItem } from "../QuestPage/types";
import s from "./styles.module.scss";

interface RewardItemProps {
  item: QuestItem;
}

const RewardItem: React.FC<RewardItemProps> = ({ item }) => {
  return (
    <div className={s.questItem}>
      <BungieImage className={s.questIcon} src={item.displayProperties.icon} />

      <div className={s.questItemName}>{item.displayProperties.name}</div>
      <div className={s.questItemType}>{item.itemTypeAndTierDisplayName}</div>
    </div>
  );
};

export default RewardItem;
