import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import Image from "next/image";
import React, { useMemo } from "react";
import { getIconSrc } from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import craftableIcon from "../craftable.jpg";
import RedactedText from "../Redacted";
import s from "./styles.module.scss";

interface WeaponHeaderProps {
  item: DestinyInventoryItemDefinition;
  otherDefinitions: AllDestinyManifestComponents;
}

const CLASS_NAME: Record<string, string> = {
  "0": "Titan",
  "1": "Hunter",
  "2": "Warlock",
};

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

  const isCraftable = Boolean(item.inventory?.recipeItemHash);

  return (
    <div className={s.itemSummary}>
      <BungieImage className={s.icon} src={getIconSrc(item)} />

      <h3 className={s.title}>
        <RedactedText text={item.displayProperties?.name} />
      </h3>

      <div className={s.subtitle}>
        <Attributes>
          <span className={s.itemType}>
            {CLASS_NAME[item.classType ?? -1]} {item.itemTypeDisplayName}
          </span>

          {damageTypeDef && (
            <span>
              <BungieImage
                className={s.attributeIcon}
                src={getIconSrc(damageTypeDef)}
              />{" "}
              {damageTypeDef.displayProperties?.name}
            </span>
          )}

          {ammoType && (
            <span data-ammo-type>
              <BungieImage className={s.attributeIcon} src={ammoType.icon} />{" "}
              {ammoType.name}
            </span>
          )}

          {isCraftable && (
            <span>
              <Image alt="" src={craftableIcon} className={s.attributeIcon} />{" "}
              Craftable
            </span>
          )}
        </Attributes>
      </div>
    </div>
  );
};

function Attributes({ children }: { children: React.ReactNode }) {
  return <div className={s.attributes}>{children}</div>;
}

export default WeaponHeader;
