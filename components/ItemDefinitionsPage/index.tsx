import {
  DestinyInventoryItemDefinition,
  destinyManifestLanguages,
} from "bungie-api-ts/destiny2";
import React from "react";
import BungieImage from "../BungieImage";
import ItemTags from "../ItemSummary/ItemTags";

import s from "./styles.module.scss";

export interface ItemDefinitionPageProps {
  definition: DestinyInventoryItemDefinition;
}

// const energySymbols = {
//   solar: "",
//   void: "",
//   arc: "",
//   stasis: "",
// }

const ItemDefinitionPage: React.FC<ItemDefinitionPageProps> = ({
  definition,
}) => {
  return (
    <div className={s.root}>
      <div className={s.bg}>
        <BungieImage className={s.bgImage} src={definition.screenshot} />
      </div>

      <div className={s.page}>
        <div className={s.content}>
          <div className={s.itemSummary}>
            {/* <div className={s.itemAccessory}> */}
            <BungieImage
              className={s.icon}
              src={definition.displayProperties.icon}
            />
            {/* </div> */}

            <div className={s.itemSummaryContent}>
              <h1 className={s.title}>
                <span>{definition.displayProperties.name}</span>
              </h1>

              <p className={s.subtitle}>
                {definition.itemTypeAndTierDisplayName}
              </p>
            </div>
          </div>

          <div className={s.box}>
            <p className={s.desc}>
              {definition.displayProperties.description ||
                definition.flavorText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDefinitionPage;
