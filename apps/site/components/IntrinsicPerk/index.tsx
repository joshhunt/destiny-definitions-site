import { DestinyInventoryItemDefinition } from "@destiny-definitions/common";
import React from "react";
import BungieImage from "../BungieImage";
import s from "./styles.module.scss";

interface IntrinsicPerkProps {
  def: DestinyInventoryItemDefinition;
}

export default function IntrinsicPerk({ def }: IntrinsicPerkProps) {
  const { name, description, icon } = def.displayProperties ?? {};
  if (!name) return null;

  return (
    <div className={s.root}>
      <div className={s.accessory}>
        <BungieImage className={s.icon} src={icon} alt="Perk icon" />
      </div>

      <div className={s.main}>
        <div className={s.name}>{name}</div>
        {description && <div className={s.description}>{description}</div>}
      </div>
    </div>
  );
}
