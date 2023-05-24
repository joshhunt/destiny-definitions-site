import { DestinyInventoryItemDefinition } from "@destiny-definitions/common";
import React from "react";
import { getIconSrc, getDisplayName, getDescription } from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import RedactedText from "../Redacted";
import s from "./styles.module.scss";

interface ItemSummaryProps {
  item: DestinyInventoryItemDefinition;
  noDescription?: boolean;
}

const ItemSummary: React.FC<ItemSummaryProps> = ({ item, noDescription }) => (
  <div className={s.largePerk}>
    <BungieImage className={s.largePerkIcon} src={getIconSrc(item)} />

    <div className={s.largePerkName} style={{ fontWeight: 500 }}>
      <RedactedText text={getDisplayName(item)} />
    </div>

    {!noDescription && (
      <div className={s.largePerkDescription}>
        <RedactedText text={getDescription(item) ?? item.itemTypeDisplayName} />
      </div>
    )}
  </div>
);

export default ItemSummary;
