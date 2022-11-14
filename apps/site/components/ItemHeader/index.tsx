import React from "react";
import BungieImage from "../BungieImage";
import { QuestItem } from "../QuestPage/types";

import s from "./styles.module.scss";

interface ItemHeaderProps {
  item: QuestItem;
  subtitle?: React.ReactNode;
}

const ItemHeader: React.FC<ItemHeaderProps> = ({ item }) => {
  const name =
    item.setData?.questLineName ||
    item.displayProperties.name ||
    item.displayProperties?.name ||
    "";

  return (
    <div className={s.itemSummary}>
      <BungieImage className={s.icon} src={item.displayProperties.icon} />

      <div>
        <h2 className={s.title}>
          <span>{name}</span>
        </h2>

        <p className={s.subtitle}>{item.itemTypeAndTierDisplayName}</p>
      </div>
    </div>
  );
};

export default ItemHeader;
