import {
  DestinyInventoryItemDefinition,
  destinyManifestLanguages,
} from "bungie-api-ts/destiny2";
import React from "react";
import BungieImage from "../BungieImage";

import s from "./styles.module.scss";

export interface ItemDefinitionPageProps {
  definition: DestinyInventoryItemDefinition;
}

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
          <h1 className={s.title}>
            <BungieImage
              className={s.icon}
              src={definition.displayProperties.icon}
            />
            <span>{definition.displayProperties.name}</span>
          </h1>

          <div className={s.box}>
            <p className={s.desc}>{definition.displayProperties.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDefinitionPage;
