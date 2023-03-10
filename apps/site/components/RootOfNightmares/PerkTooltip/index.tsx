import { DestinyInventoryItemDefinition } from "@destiny-definitions/common";
import { getDisplayName, getDescription, getIconSrc } from "../../../lib/utils";
import React from "react";
import s from "./styles.module.scss";

interface PerkTooltipProps {
  perkItem: DestinyInventoryItemDefinition;
  enhancedPerkItem: DestinyInventoryItemDefinition | undefined;
}

const PerkTooltip: React.FC<PerkTooltipProps> = ({
  perkItem,
  enhancedPerkItem,
}) => {
  return (
    <div className={s.root}>
      <div className={s.header}>
        <div className={s.name}>{getDisplayName(perkItem)}</div>
        <div className={s.type}>{perkItem.itemTypeDisplayName}</div>
      </div>

      <div className={s.body}>
        <p className={s.description}>{getDescription(perkItem)}</p>

        {enhancedPerkItem && (
          <p className={s.availableEnhanced}>
            Also available as an enhanced perk for weapon crafting.
          </p>
        )}
      </div>
    </div>
  );
};

export default PerkTooltip;
