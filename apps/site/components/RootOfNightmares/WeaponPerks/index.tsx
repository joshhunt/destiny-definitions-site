import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import React from "react";
import { getIconSrc, notEmpty } from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import s from "./styles.module.scss";
import LargePerk from "../LargePerk";
import WeaponHeading from "../WeaponHeading";
import {
  DestinySocketCategoryStyle,
  SocketCategory,
  useWeaponSockets,
} from "./hooks";
import SmallPerk from "../SmallPerk";

interface WeaponPerksProps {
  item: DestinyInventoryItemDefinition;
  otherDefinitions: AllDestinyManifestComponents;
}

const WeaponPerks: React.FC<WeaponPerksProps> = ({
  item,
  otherDefinitions,
}) => {
  const socketCategories = useWeaponSockets(item, otherDefinitions);

  return (
    <div>
      {socketCategories.map((category) => {
        return (
          <div className={s.socketCategory}>
            <SocketCategoryRenderer category={category} />
          </div>
        );
      })}
    </div>
  );
};

interface SocketCategoryRendererProps {
  category: SocketCategory;
}

const SocketCategoryRenderer: React.FC<SocketCategoryRendererProps> = ({
  category: socketCategory,
}) => {
  const { category } = socketCategory;

  if (category.categoryStyle === DestinySocketCategoryStyle.LargePerk) {
    return <SocketCategoryLargePerk category={socketCategory} />;
  }

  if (category.categoryStyle === DestinySocketCategoryStyle.Reusable) {
    return <SocketCategoryPerks category={socketCategory} />;
  }

  if (category.categoryStyle === DestinySocketCategoryStyle.Consumable) {
    return <SocketCategoryConsumable category={socketCategory} />;
  }

  return (
    <div>
      unknown socket category renderer for categoryStyle{" "}
      {category.categoryStyle}
    </div>
  );
};

function LargePerkList({
  perks,
  noDescription,
}: {
  perks: DestinyInventoryItemDefinition[];
  noDescription?: boolean;
}) {
  return (
    <div className={s.largePerkList}>
      {perks.map((perkItem) => (
        <LargePerk perkItem={perkItem} noDescription={noDescription} />
      ))}
    </div>
  );
}

const SocketCategoryLargePerk: React.FC<
  SocketCategoryRendererProps & { noDescription?: boolean }
> = ({ category, noDescription }) => {
  const plugs = category.sockets.map((v) => v.initialPlug).filter(notEmpty);

  return (
    <div>
      <WeaponHeading>
        {category.category?.displayProperties?.name}
      </WeaponHeading>

      <LargePerkList perks={plugs} noDescription={noDescription} />
    </div>
  );
};

interface DedupedPerk {
  perk: DestinyInventoryItemDefinition;
  enhancedPerk?: DestinyInventoryItemDefinition;
}

const SocketCategoryPerks: React.FC<SocketCategoryRendererProps> = ({
  category,
}) => {
  const socketsHaveOptions = category.sockets.some((v) => v.plugOptions);

  if (!socketsHaveOptions) {
    return <SocketCategoryLargePerk category={category} noDescription={true} />;
  }

  return (
    <div>
      <WeaponHeading>
        {category.category?.displayProperties?.name}
      </WeaponHeading>

      <div data-category-perks className={s.horizontalSockets}>
        {category.sockets.map(({ plugOptions, initialPlug }) => {
          const plugItems = [...(plugOptions ?? []), initialPlug]
            .filter(notEmpty)
            .sort(
              // sort enhanced to the end
              (a, b) =>
                (a.inventory?.tierType ?? 0) - (b.inventory?.tierType ?? 0)
            );

          const deduped: DedupedPerk[] = [];

          for (const perk of plugItems) {
            const tierType = perk.inventory?.tierType ?? 0;

            if (tierType === 3) {
              const basicPerk = deduped.find(
                (v) =>
                  v.perk.displayProperties?.name ===
                    perk.displayProperties?.name &&
                  v.perk.inventory?.tierType === 2
              );
              if (basicPerk) {
                basicPerk.enhancedPerk = perk;
              }
            } else {
              deduped.push({ perk });
            }
          }

          return (
            <div className={s.smallPerkList}>
              {deduped.map((plugItem) => (
                <SmallPerk
                  perkItem={plugItem.perk}
                  enhancedPerkItem={plugItem.enhancedPerk}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SocketCategoryConsumable: React.FC<SocketCategoryRendererProps> = ({
  category,
}) => {
  const plugs = category.sockets.map((v) => v.initialPlug);

  return (
    <div>
      <WeaponHeading>
        {category.category?.displayProperties?.name}
      </WeaponHeading>

      <div data-category-perks className={s.horizontalSockets}>
        {plugs.map((plugItem) => (
          <div className={s.largePerk}>
            <BungieImage
              className={s.smallPerkIcon}
              src={getIconSrc(plugItem)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaponPerks;
