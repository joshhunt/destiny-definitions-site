import React from "react";
import { ItemPageQuery } from "../../lib/graphql/types.generated";
import ItemHeader from "../ItemHeader/QLItemHeader";

import s from "./styles.module.scss";

export interface ItemPageProps {
  data: ItemPageQuery;
}

const ItemPage: React.FC<ItemPageProps> = ({ data: { item } }) => {
  if (!item) {
    return null;
  }

  const sockets = item.sockets?.socketEntries ?? [];
  const randomSockets = sockets.filter((v) => v?.randomizedPlugSet);

  return (
    <div className={s.root}>
      <ItemHeader item={item} />

      {randomSockets.map((socket) => (
        <>
          <ul>
            {socket?.randomizedPlugSet?.reusablePlugItems?.map((v) => (
              <li>{v?.plugItem?.displayProperties?.name}</li>
            ))}
          </ul>

          <hr />
        </>
      ))}
    </div>
  );
};

export default ItemPage;
