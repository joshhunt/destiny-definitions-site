import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import React from "react";
import getItemTags from "./itemTags";
import s from "./styles.module.scss";

interface ItemTagsProps {
  definition: DestinyInventoryItemDefinition;
}

const RPM_STAT_HASH = 4284893193;

const ItemTags: React.FC<ItemTagsProps> = ({ definition }) => {
  const tags = getItemTags(definition);
  const rpmStat = definition.stats?.stats?.[RPM_STAT_HASH]?.value;

  return (
    <>
      {tags.map((t, index) => (
        <span key={index} className={s.tag} data-tag={t}>
          {t}
        </span>
      ))}

      {rpmStat && <span className={s.emptyTag}>{rpmStat} RPM</span>}
    </>
  );
};

export default ItemTags;
