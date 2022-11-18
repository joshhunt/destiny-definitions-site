import s from "./styles.module.scss";
import BungieImage from "../BungieImage";
import IntrinsicPerk from "../IntrinsicPerk";
import React from "react";
import ItemTags from "./ItemTags";
import {
  AllDestinyManifestComponents,
  DefinitionTable,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";

interface ItemSummaryProps {
  definition: DestinyInventoryItemDefinition;
  definitions: DefinitionTable<DestinyInventoryItemDefinition>;
  otherDefinitions: AllDestinyManifestComponents;
}

function findIntrinsicPerk(
  itemDef: DestinyInventoryItemDefinition,
  otherItemDefinitions: DefinitionTable<DestinyInventoryItemDefinition>
) {
  const socket = itemDef.sockets?.socketEntries?.find((socket) => {
    if (!socket?.singleInitialItemHash) return false;

    const def = otherItemDefinitions[socket.singleInitialItemHash];
    return (
      def?.uiItemDisplayStyle === "ui_display_style_intrinsic_plug" &&
      def.displayProperties?.name
    );
  });

  return (
    socket?.singleInitialItemHash &&
    otherItemDefinitions[socket.singleInitialItemHash]
  );
}

export default function ItemSummary({
  definition: def,
  definitions,
  otherDefinitions,
}: ItemSummaryProps) {
  const { DestinyInventoryItemDefinition: otherItemDefs = {} } =
    otherDefinitions;

  const isExotic = def.inventory?.tierType === 6 ?? false;
  const intrinsicPerk = isExotic && findIntrinsicPerk(def, otherItemDefs);

  console.log(def.hash, { def, isExotic, intrinsicPerk });

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
