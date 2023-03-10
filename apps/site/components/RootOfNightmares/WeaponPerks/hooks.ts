import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
  DestinySocketCategoryDefinition,
} from "@destiny-definitions/common";
import { notEmpty } from "../../../lib/utils";

export interface SocketData {
  initialPlug?: DestinyInventoryItemDefinition;
  plugOptions?: DestinyInventoryItemDefinition[];
}

export interface SocketCategory {
  category: DestinySocketCategoryDefinition;
  sockets: Array<SocketData>;
}

const HIDDEN_PLUG_ITEMS = [905869860, 2240097604, 2302094943];

const PRETEND_INTRINSIC = [1105347996, 1281243303, 3186078099];

const HIDE_SOCKET_CATEGORIES = [
  2048875504, 2685412949, 3583996951, 3201856887, 3128524174,
];

export const DestinySocketCategoryStyle = {
  Unknown: 0,
  Reusable: 1,
  Consumable: 2,
  Unlockable: 3,
  Intrinsic: 4,
  EnergyMeter: 5,
  LargePerk: 6,
  Abilities: 7,
  Supers: 8,
};

export function useWeaponSockets(
  item: DestinyInventoryItemDefinition,
  otherDefinitions: AllDestinyManifestComponents
): SocketCategory[] {
  const sockets = item.sockets?.socketEntries ?? [];

  const socketCategories: SocketCategory[] =
    item.sockets?.socketCategories
      ?.filter(
        (v) => !HIDE_SOCKET_CATEGORIES.includes(v.socketCategoryHash ?? -1)
      )
      .map((socketCategory) => {
        const catSockets =
          socketCategory.socketIndexes?.map((v) => sockets[v]) ?? [];

        const category =
          otherDefinitions.DestinySocketCategoryDefinition?.[
            socketCategory.socketCategoryHash ?? -1
          ];

        if (!category) throw new Error("missing socket category");

        const socketsData = catSockets.map((v) => {
          const initialPlugItem =
            otherDefinitions.DestinyInventoryItemDefinition?.[
              v.singleInitialItemHash ?? -1
            ];

          const randomPlugSet =
            otherDefinitions.DestinyPlugSetDefinition?.[
              v.randomizedPlugSetHash ?? -1
            ];

          if (randomPlugSet) {
            return {
              plugOptions: randomPlugSet.reusablePlugItems
                ?.filter(
                  (v) => !HIDDEN_PLUG_ITEMS.includes(v.plugItemHash ?? -1)
                )
                .map(
                  (v) =>
                    otherDefinitions.DestinyInventoryItemDefinition?.[
                      v.plugItemHash ?? -1
                    ]
                )
                .filter(notEmpty),
            };
          }

          if (
            initialPlugItem &&
            !HIDDEN_PLUG_ITEMS.includes(initialPlugItem.hash ?? -1)
          ) {
            return {
              initialPlug: initialPlugItem,
            };
          }

          return {};
        });

        return {
          category,
          sockets: socketsData,
        };
      }) ?? [];

  for (const socketCategory of socketCategories) {
    if (
      socketCategory.category.categoryStyle ===
      DestinySocketCategoryStyle.LargePerk
    ) {
      continue;
    }

    for (const socket of socketCategory.sockets) {
      if (PRETEND_INTRINSIC.includes(socket.initialPlug?.hash ?? -1)) {
        const socketIndex = socketCategory.sockets.indexOf(socket);
        const intrinsicCategory = socketCategories.find(
          (v) =>
            v.category.categoryStyle === DestinySocketCategoryStyle.LargePerk
        );

        if (intrinsicCategory) {
          intrinsicCategory.sockets.push(socket);
          socketCategory.sockets.splice(socketIndex, socketIndex);
        }
      }
    }
  }

  return socketCategories;
}
