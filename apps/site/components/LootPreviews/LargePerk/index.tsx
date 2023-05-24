import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import React from "react";
import {
  getIconSrc,
  getDisplayName,
  getDescription,
  notEmpty,
} from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import s from "./styles.module.scss";

interface LargePerkProps {
  perkItem: DestinyInventoryItemDefinition;
  noDescription?: boolean;
  otherDefinitions?: AllDestinyManifestComponents;
}

const LargePerk: React.FC<LargePerkProps> = ({
  perkItem,
  noDescription,
  otherDefinitions,
}) => {
  const perkDefs = otherDefinitions?.DestinySandboxPerkDefinition;

  const sandboxPerks =
    perkDefs &&
    perkItem.perks
      ?.map((v) => perkDefs[v.perkHash ?? -1])
      .filter(notEmpty)
      .filter((v) => v.displayProperties?.description);

  return (
    <div className={s.largePerk}>
      <BungieImage className={s.largePerkIcon} src={getIconSrc(perkItem)} />

      <div className={s.largePerkName} style={{ fontWeight: 500 }}>
        {getDisplayName(perkItem)}
      </div>

      {!noDescription &&
        ((sandboxPerks?.length ?? 0) > 0 ? (
          <div className={s.largePerkDescription}>
            {sandboxPerks?.map((v) => getDescription(v))}
          </div>
        ) : (
          <div className={s.largePerkDescription}>
            {getDescription(perkItem)}
          </div>
        ))}
    </div>
  );
};

export default LargePerk;
