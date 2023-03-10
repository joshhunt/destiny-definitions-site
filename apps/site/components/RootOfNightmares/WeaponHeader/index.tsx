import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import React from "react";
import { getIconSrc } from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import RedactedText from "../Redacted";
import s from "./styles.module.scss";

interface WeaponHeaderProps {
  item: DestinyInventoryItemDefinition;
  otherDefinitions: AllDestinyManifestComponents;
}

const AMMO_TYPE: Record<number, { name: string; icon: string }> = {
  1: {
    name: "Primary",
    icon: "/img/destiny_content/ammo_types/primary.png",
  },

  2: {
    name: "Special",
    icon: "/img/destiny_content/ammo_types/special.png",
  },

  3: {
    name: "Heavy",
    icon: "/img/destiny_content/ammo_types/heavy.png",
  },
};

const WeaponHeader: React.FC<WeaponHeaderProps> = ({
  item,
  otherDefinitions,
}) => {
  const damageTypeDef =
    otherDefinitions.DestinyDamageTypeDefinition?.[
      item.defaultDamageTypeHash ?? -1
    ];

  const ammoType = AMMO_TYPE[item.equippingBlock?.ammoType ?? -1];

  return (
    <div className={s.itemSummary}>
      <BungieImage className={s.icon} src={getIconSrc(item)} />

      <h3 className={s.title}>
        <RedactedText text={item.displayProperties?.name} />
      </h3>

      <div className={s.subtitle}>
        <Attributes>
          <span className={s.itemType}>{item.itemTypeDisplayName}</span>
          {damageTypeDef && (
            <>
              <BungieImage
                className={s.attributeIcon}
                src={getIconSrc(damageTypeDef)}
              />{" "}
              {damageTypeDef.displayProperties?.name}
            </>
          )}
          {ammoType && (
            <>
              <BungieImage className={s.attributeIcon} src={ammoType.icon} />{" "}
              {ammoType.name}
            </>
          )}
        </Attributes>
      </div>
    </div>
  );
};

function Attributes({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.attributes}>
      {React.Children.map(children, (child) => (
        <div className={s.attribute}>{child}</div>
      ))}
    </div>
  );
}

export default WeaponHeader;
