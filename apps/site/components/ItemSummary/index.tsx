import s from "./styles.module.scss";
import BungieImage from "../BungieImage";
import IntrinsicPerk from "../IntrinsicPerk";
import React from "react";
import ItemTags from "./ItemTags";
import {
  DefinitionTable,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";

interface ItemSummaryProps {
  definition: DestinyInventoryItemDefinition;
  definitions: DefinitionTable<DestinyInventoryItemDefinition>;
}

function findIntrinsicPerk(
  itemDef: DestinyInventoryItemDefinition,
  definitions: DefinitionTable<DestinyInventoryItemDefinition>
) {
  const socket = itemDef.sockets?.socketEntries?.find((socket) => {
    if (!socket?.singleInitialItemHash) return false;

    const def = definitions[socket.singleInitialItemHash];
    return (
      def?.uiItemDisplayStyle === "ui_display_style_intrinsic_plug" &&
      def.displayProperties?.name
    );
  });

  return (
    socket?.singleInitialItemHash && definitions[socket.singleInitialItemHash]
  );
}

export default function ItemSummary({
  definition: def,
  definitions,
}: ItemSummaryProps) {
  const isExotic = def.inventory?.tierType === 6 ?? false;
  const intrinsicPerk = isExotic && findIntrinsicPerk(def, definitions);

  let displayName: React.ReactNode = def.displayProperties?.name;

  if (!displayName && def.setData?.questLineName) {
    displayName = <em>Quest step from '{def.setData.questLineName}'</em>;
  }

  return (
    <div className={s.itemSummary}>
      <div className={s.itemSummaryWell}>
        <BungieImage
          className={s.icon}
          src={def.displayProperties?.icon}
          alt=""
        />
      </div>

      <div className={s.itemSummaryMain}>
        <div className={s.itemHeader}>
          <span className={s.name}>{displayName || <em>No name</em>}</span>

          <ItemTags definition={def} />
        </div>

        {def.displayProperties?.description && (
          <p className={s.description}>{def.displayProperties.description}</p>
        )}

        {intrinsicPerk && <IntrinsicPerk def={intrinsicPerk} />}
      </div>
    </div>
  );
}