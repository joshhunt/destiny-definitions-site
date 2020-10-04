import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import React from "react";
import { DestinyInventoryItemDefinitionTagged } from "../../types";
import BungieImage from "../BungieImage";
import s from "./styles.module.scss";

interface IntrinsicPerkProps {
  def: DestinyInventoryItemDefinitionTagged;
}

export default function IntrinsicPerk({ def }: IntrinsicPerkProps) {
  return (
    <div className={s.root}>
      <div className={s.accessory}>
        <BungieImage className={s.icon} src={def.displayProperties.icon} />
      </div>

      <div className={s.main}>
        <div className={s.name}>{def.displayProperties.name}</div>
        <div className={s.description}>{def.displayProperties.description}</div>
      </div>
    </div>
  );
}
