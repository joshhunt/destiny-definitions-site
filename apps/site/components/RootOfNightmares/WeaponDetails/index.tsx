import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import React from "react";
import s from "./styles.module.scss";
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
    <div className={s.item} id={`item_${item.hash}`}>
      <WeaponHeader item={item} otherDefinitions={otherDefinitions} />

      <p>
        <em>{item.flavorText}</em>
      </p>

      <div className={s.detailsSplit}>
        <WeaponStats item={item} otherDefinitions={otherDefinitions} />
        <WeaponPerks item={item} otherDefinitions={otherDefinitions} />
      </div>
    </div>
  );
};

export default WeaponDetails;
