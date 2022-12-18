import React from "react";
import { getDisplayName, getIconSrc } from "../../lib/utils";
import BungieImage from "../BungieImage";
import { QuestItem } from "../QuestPage/types";
import s from "./styles.module.scss";

interface RewardItemProps {
  item: QuestItem;
}

const RewardItem: React.FC<RewardItemProps> = ({ item }) => {
  return (
    <div className={s.questItem}>
      <BungieImage className={s.questIcon} src={getIconSrc(item)} />

      <div className={s.questItemName}>{getDisplayName(item)}</div>
      {item?.itemTypeAndTierDisplayName && (
        <div className={s.questItemType}>{item.itemTypeAndTierDisplayName}</div>
      )}
    </div>
  );
};

export default RewardItem;
