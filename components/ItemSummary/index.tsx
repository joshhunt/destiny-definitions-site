import s from "./styles.module.scss";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import BungieImage from "../BungieImage";
import getItemTags from "./itemTags";

interface ItemSummaryProps {
  def: DestinyInventoryItemDefinition;
}

export default function ItemSummary({ def }: ItemSummaryProps) {
  const tags = getItemTags(def);

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

          {tags.map((t) => (
            <span className={s.tag} data-tag={t}>
              {t}
            </span>
          ))}
        </div>

        {def.displayProperties.description && (
          <p className={s.description}>{def.displayProperties.description}</p>
        )}
      </div>
    </div>
  );
}
