import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
  DestinyLoreDefinition,
  DestinyPresentationNodeDefinition,
} from "@destiny-definitions/common";
import { groupBy, sortBy } from "lodash";
import { notEmpty } from "../../lib/utils";
import ItemSummary from "./ItemSummary";
import GenericItem from "./GenericItem";
import SectionHeading from "./SectionHeading";
import s from "./styles.module.scss";
import WeaponDetails from "./WeaponDetails";
import WeaponHeader from "./WeaponHeader";
import WeaponHeading from "./WeaponHeading";
import RedactedText from "./Redacted";
import { DestinyItemPlugDefinition } from "bungie-api-ts/destiny2";

export interface S21LootPreviewPageProps {
  weapons: DestinyInventoryItemDefinition[];
  armor: DestinyInventoryItemDefinition[];
  cosmetics: DestinyInventoryItemDefinition[];
  otherDefinitions: AllDestinyManifestComponents;
}

export interface LoreCollection {
  bookPresentationNode: DestinyPresentationNodeDefinition;
  pages: DestinyLoreDefinition[];
}

const BUCKET_ORDER = ["1498876634", "2465295065", "953998645"];

const CLASS_NAME: Record<string, string> = {
  "0": "Titan",
  "1": "Hunter",
  "2": "Warlock",
};

const armorBucketOrder = [
  3448274439, // helmet
  3551918588, // arms
  14239492, // chest
  20886954, // legs
  1585787867, // classItem
];

const modOrder = [
  -9, 539051925, 1389309840, 1947468772, 4243059257, 2158846614, 1036972936,
  1036972937, 1036972938, 1036972939,
];

const loreOrder = [
  3475635982, 630432767, 824228793, 3846650177, 2138394740, 3810243376,
  3608027009, 2787963735, 807905267, 621315878, 4123705451, 2445962586,
  2597227950, 3702434452, 2915322487,
];

function weaponSorter(item: DestinyInventoryItemDefinition) {
  const index =
    BUCKET_ORDER.indexOf((item?.inventory?.bucketTypeHash ?? -1).toString()) ??
    999;
  return index;
}

function armorSorter(item: DestinyInventoryItemDefinition) {
  const index =
    armorBucketOrder.indexOf(item?.inventory?.bucketTypeHash ?? -1) ?? 999;
  return index;
}

function indexSorter(item: DestinyInventoryItemDefinition) {
  return item.index;
}

function modSorter(item: DestinyInventoryItemDefinition) {
  return modOrder.indexOf(item.hash ?? -1) || 9999;
}

function classTypeSorter(item: DestinyInventoryItemDefinition) {
  return item.classType ?? -1;
}

export default function S21LootPreview(props: S21LootPreviewPageProps) {
  const { weapons, armor, cosmetics, otherDefinitions } = props;

  const sortedWeapons = sortBy(
    weapons.filter(notEmpty),
    weaponSorter,
    indexSorter
  );

  const weaponsBySlot = groupBy(
    sortedWeapons,
    (v) => v.inventory?.bucketTypeHash
  );

  const armorByClass = groupBy(armor, (v) => v.classType ?? -1);

  const itemsWithLore = [...armor, ...weapons, ...cosmetics].filter(
    (v) => v.loreHash
  );

  return (
    <div className={s.root}>
      {/* <div className={s.spoilerDisclaimer}>
        <div className={s.spoilerContent}>spoiler disclaimer</div>
      </div> */}

      <div className={s.hero}>
        <div className={s.heroText}>
          <h2 className={s.subtitle}>Loot preview</h2>
          <h1 className={s.pageTitle}>Ghosts of the Deep</h1>
        </div>
      </div>

      <div className={s.section}>
        <SectionHeading>Armor</SectionHeading>

        <div className={s.weaponBuckets}>
          {Object.entries(armorByClass)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([classType, armorForClass]) => {
              const className = CLASS_NAME[classType];

              return (
                <div key={classType}>
                  <WeaponHeading>{className}</WeaponHeading>

                  <div className={s.gearList}>
                    {sortBy(armorForClass, armorSorter).map((item) => (
                      <a
                        key={item.hash}
                        className={s.invisibleLink}
                        href={`#item_${item.hash}`}
                      >
                        <ItemSummary item={item} />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className={s.section}>
        <SectionHeading>Weapons</SectionHeading>

        <div className={s.weaponBuckets}>
          {Object.entries(weaponsBySlot)
            .sort(
              ([a], [b]) => BUCKET_ORDER.indexOf(a) - BUCKET_ORDER.indexOf(b)
            )
            .map(([bucketHash, weaponsForBucket]) => {
              const bucketDef =
                otherDefinitions.DestinyInventoryBucketDefinition?.[
                  bucketHash ?? -1
                ];

              return (
                <div key={bucketHash}>
                  <WeaponHeading>
                    {bucketDef?.displayProperties?.name}
                  </WeaponHeading>

                  <div className={s.gearList}>
                    {sortBy(weaponsForBucket, indexSorter).map((item) => (
                      <a
                        key={item.hash}
                        className={s.invisibleLink}
                        href={`#item_${item.hash}`}
                      >
                        <ItemSummary item={item} />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className={s.section}>
        <SectionHeading>Cosmetics</SectionHeading>

        <div className={s.modList}>
          {sortBy(cosmetics.filter(notEmpty), modSorter).map((item) => (
            <div key={item.hash}>
              <GenericItem
                perkItem={item}
                otherDefinitions={otherDefinitions}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={s.section}>
        <SectionHeading>Weapon rolls</SectionHeading>

        {sortedWeapons.map((item) => (
          <div key={item.hash}>
            <WeaponDetails item={item} otherDefinitions={otherDefinitions} />
          </div>
        ))}
      </div>

      <div className={s.section}>
        <SectionHeading>Lore</SectionHeading>

        {sortBy(itemsWithLore, classTypeSorter, armorSorter, indexSorter).map(
          (item) => {
            const loreDef =
              otherDefinitions.DestinyLoreDefinition?.[item.loreHash ?? -1];

            return (
              <div className={s.loreBox} id={`item_${item.hash}`}>
                <WeaponHeader item={item} otherDefinitions={otherDefinitions} />

                <h4>
                  <em>
                    <RedactedText text={item.flavorText} />
                  </em>
                </h4>
                <div className={s.lore}>
                  <RedactedText
                    text={loreDef?.displayProperties?.description}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
