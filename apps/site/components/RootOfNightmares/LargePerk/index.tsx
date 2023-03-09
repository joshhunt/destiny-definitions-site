import { DestinyInventoryItemDefinition } from "@destiny-definitions/common";
import React from "react";
import { getIconSrc, getDisplayName, getDescription } from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import s from "./styles.module.scss";

interface LargePerkProps {
  perkItem: DestinyInventoryItemDefinition;
  noDescription?: boolean;
}

const LargePerk: React.FC<LargePerkProps> = ({ perkItem, noDescription }) => (
  <div className={s.largePerk}>
    <BungieImage className={s.largePerkIcon} src={getIconSrc(perkItem)} />

    <div className={s.largePerkName} style={{ fontWeight: 500 }}>
      {getDisplayName(perkItem)}
    </div>

    {!noDescription && (
      <div className={s.largePerkDescription}>{getDescription(perkItem)}</div>
    )}
  </div>
);

export default LargePerk;
