import s from "./styles.module.scss";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import BungieImage from "../BungieImage";

interface ItemSummaryProps {
  def: DestinyInventoryItemDefinition;
}

export default function ItemSummary({ def }: ItemSummaryProps) {
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
        </div>

        {def.displayProperties.description && (
          <p className={s.description}>{def.displayProperties.description}</p>
        )}
      </div>
    </div>
  );
}
