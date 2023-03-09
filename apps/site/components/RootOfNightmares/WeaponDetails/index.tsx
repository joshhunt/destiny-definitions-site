import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import React from "react";
import BungieImage from "../../BungieImage";
import s from "./styles.module.scss";
import { getIconSrc } from "../../../lib/utils";
import WeaponStats from "../WeaponStats";
import WeaponHeader from "../WeaponHeader";
import WeaponPerks from "../WeaponPerks";

interface WeaponDetailsProps {
  item: DestinyInventoryItemDefinition;
  otherDefinitions: AllDestinyManifestComponents;
}

const WeaponDetails: React.FC<WeaponDetailsProps> = ({
  item,
  otherDefinitions,
}) => {
  return (
    <div className={s.item}>
      <WeaponHeader item={item} otherDefinitions={otherDefinitions} />

      <div className={s.detailsSplit}>
        <WeaponStats item={item} otherDefinitions={otherDefinitions} />
        <WeaponPerks item={item} otherDefinitions={otherDefinitions} />
      </div>
    </div>
  );
};

export default WeaponDetails;
