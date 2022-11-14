import React from "react";
import { QLDisplayableItemFragment } from "../../lib/graphql/types.generated";
import BungieImage from "../BungieImage";
import { QuestItem } from "../QuestPage/types";

import s from "./styles.module.scss";

interface ItemHeaderProps {
  item: QLDisplayableItemFragment;
}

const ItemHeader: React.FC<ItemHeaderProps> = ({ item }) => {
  const name = item.displayProperties?.name || "";
  const icon = item.displayProperties?.icon;

  return (
    <div className={s.itemSummary}>
      {icon && <BungieImage className={s.icon} src={icon} />}

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
