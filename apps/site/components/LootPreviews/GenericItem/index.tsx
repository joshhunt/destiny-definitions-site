import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import React from "react";
import { getIconSrc, getDisplayName } from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import s from "./styles.module.scss";
import RedactedText from "../Redacted";

interface GenericItemProps {
  perkItem: DestinyInventoryItemDefinition;
  noDescription?: boolean;
  otherDefinitions?: AllDestinyManifestComponents;
}

const GenericItem: React.FC<GenericItemProps> = ({ perkItem }) => {
  const name = getDisplayName(perkItem) ?? "";

  return (
    <div className={s.largePerk}>
      <BungieImage className={s.largePerkIcon} src={getIconSrc(perkItem)} />

      <div className={s.largePerkName} style={{ fontWeight: 500 }}>
        <RedactedText text={name} />
      </div>

      <div className={s.largePerkDescription}>
        {perkItem?.itemTypeDisplayName}
      </div>
    </div>
  );
};

export default GenericItem;
