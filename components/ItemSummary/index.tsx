import s from "./styles.module.scss";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import BungieImage from "../BungieImage";
import getItemTags from "./itemTags";
import { DestinyInventoryItemDefinitionTagged } from "../../types";
import IntrinsicPerk from "../IntrinsicPerk";

interface ItemSummaryProps {
  def: DestinyInventoryItemDefinition;
  definitions: Record<string, DestinyInventoryItemDefinitionTagged>;
}

const RPM_STAT_HASH = 4284893193;

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

export default function ItemSummary({ def, definitions }: ItemSummaryProps) {
  const tags = getItemTags(def);
  const intrinsicPerk = findIntrinsicPerk(def, definitions);

  const rpmStat = def.stats?.stats?.[RPM_STAT_HASH]?.value;

  return (
    <div className={s.itemSummary}>
      <div className={s.itemSummaryWell}>
        <BungieImage className={s.icon} src={def.displayProperties.icon} />
      </div>

      <div className={s.itemSummaryMain}>
        <div className={s.itemHeader}>
          <span className={s.name}>
            {def.displayProperties.name || <em>No name</em>}
          </span>

          {tags.map((t, index) => (
            <span key={index} className={s.tag} data-tag={t}>
              {t}
            </span>
          ))}

          {rpmStat && <span className={s.emptyTag}>{rpmStat} RPM</span>}
        </div>

        {def.displayProperties.description && (
          <p className={s.description}>{def.displayProperties.description}</p>
        )}

        {intrinsicPerk && <IntrinsicPerk def={intrinsicPerk} />}
      </div>
    </div>
  );
}
