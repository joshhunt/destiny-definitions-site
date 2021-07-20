import s from "./styles.module.scss";
import {
  DestinyInventoryItemDefinition,
  TierType,
} from "bungie-api-ts/destiny2";
import BungieImage from "../BungieImage";
import { DestinyInventoryItemDefinitionTagged } from "../../types";
import IntrinsicPerk from "../IntrinsicPerk";
import React from "react";
import ItemTags from "./ItemTags";

interface ItemSummaryProps {
  definition: DestinyInventoryItemDefinition;
  definitions: Record<string, DestinyInventoryItemDefinitionTagged>;
}

function findIntrinsicPerk(
  itemDef: DestinyInventoryItemDefinition,
  definitions: Record<string, DestinyInventoryItemDefinitionTagged>
) {
  const socket = itemDef.sockets?.socketEntries?.find((socket) => {
    const def = definitions[socket.singleInitialItemHash];
    return (
      def?.uiItemDisplayStyle === "ui_display_style_intrinsic_plug" &&
      def.displayProperties.name
    );
  });

  return socket && definitions[socket.singleInitialItemHash];
}

export default function ItemSummary({
  definition: def,
  definitions,
}: ItemSummaryProps) {
  const isExotic = def.inventory?.tierType === 6 ?? false;
  const intrinsicPerk = isExotic && findIntrinsicPerk(def, definitions);

  return (
    <div className={s.itemSummary}>
      <div className={s.itemSummaryWell}>
        <BungieImage
          className={s.icon}
          src={def.displayProperties.icon}
          alt={
            def.displayProperties.name
              ? `Icon of "${def.displayProperties.name}"`
              : "Icon of this entity"
          }
        />
      </div>

      <div className={s.itemSummaryMain}>
        <div className={s.itemHeader}>
          <span className={s.name}>
            {def.displayProperties.name || <em>No name</em>}
          </span>

          <ItemTags definition={def} />
        </div>

        {def.displayProperties.description && (
          <p className={s.description}>{def.displayProperties.description}</p>
        )}

        {intrinsicPerk && <IntrinsicPerk def={intrinsicPerk} />}
      </div>
    </div>
  );
}
