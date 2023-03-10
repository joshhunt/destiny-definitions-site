import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import { groupBy, sortBy } from "lodash";
import { notEmpty } from "../../lib/utils";
import ItemSummary from "./ItemSummary";
import LargePerk from "./LargePerk";
import SectionHeading from "./SectionHeading";
import s from "./styles.module.scss";
import WeaponDetails from "./WeaponDetails";
import WeaponHeading from "./WeaponHeading";

export interface RootOfNightmaresPageProps {
  weapons: DestinyInventoryItemDefinition[];
  armor: DestinyInventoryItemDefinition[];
  mods: DestinyInventoryItemDefinition[];
  otherDefinitions: AllDestinyManifestComponents;
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
  539051925, 1389309840, 1947468772, 4243059257, 2158846614, 1036972936,
  1036972937, 1036972938, 1036972939,
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
  return modOrder.indexOf(item.hash) ?? 9999;
}

export default function RootOfNightmaresPage(props: RootOfNightmaresPageProps) {
  const { weapons, armor, mods, otherDefinitions } = props;

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

  return (
    <div className={s.root}>
      {/* <div className={s.spoilerDisclaimer}>
        <div className={s.spoilerContent}>spoiler disclaimer</div>
      </div> */}

      <div className={s.hero}>
        <div className={s.heroText}>
          <h2 className={s.subtitle}>Loot preview</h2>
          <h1 className={s.pageTitle}>Root of Nightmares</h1>
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
                      <ItemSummary key={item.hash} item={item} />
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
        <SectionHeading>Raid mods</SectionHeading>

        <div className={s.modList}>
          {sortBy(mods.filter(notEmpty), modSorter).map((item) => (
            <div key={item.hash}>
              <LargePerk perkItem={item} otherDefinitions={otherDefinitions} />
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
        <p className={s.loreExplainer}>
          <em>Lore pages available after raid clear</em>
        </p>
      </div>
    </div>
  );
}
