import { DestinyInventoryItemDefinition } from "@destiny-definitions/common";
import React from "react";
import BungieImage from "../BungieImage";
import ItemHeader from "../ItemHeader";

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
          <ItemHeader item={definition} />

          <div className={s.box}>
            <p className={s.desc}>
              {definition.displayProperties?.description ||
                definition.flavorText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDefinitionPage;
