import React from "react";
import { QLItemPageQuery } from "../../lib/graphql/types.generated";
import ItemHeader from "../ItemHeader/QLItemHeader";

import s from "./styles.module.scss";

export interface ItemPageProps {
  data: QLItemPageQuery;
}

const ItemPage: React.FC<ItemPageProps> = ({ data: { item } }) => {
  if (!item) {
    return null;
  }

  const sockets = item.sockets?.socketEntries ?? [];
  // const randomSockets = sockets.filter((v) => v?.randomizedPlugSet);

  return (
    <div className={s.root}>
      <ItemHeader item={item} />

      {sockets.map((socket, index) => (
        <>
          <ul>
            {socket?.randomizedPlugSet?.reusablePlugItems?.map(
              (v) =>
                v?.plugItem?.displayProperties?.name && (
                  <li>
                    {v.plugItem.hash} {v.plugItem.displayProperties.name}
                  </li>
                )
            )}
          </ul>

          <hr />
        </>
      ))}
    </div>
  );
};

export default ItemPage;
