import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import { groupBy } from "lodash";
import ItemSummary from "./ItemSummary";
import s from "./styles.module.scss";
import WeaponDetails from "./WeaponDetails";
import WeaponHeading from "./WeaponHeading";

export interface RootOfNightmaresPageProps {
  weapons: DestinyInventoryItemDefinition[];
  armor: DestinyInventoryItemDefinition[];
  otherDefinitions: AllDestinyManifestComponents;
}

const BUCKET_ORDER = ["1498876634", "2465295065", "953998645"];

const CLASS_NAME: Record<string, string> = {
  "0": "Titan",
  "1": "Hunter",
  "2": "Warlock",
};

export default function RootOfNightmaresPage(props: RootOfNightmaresPageProps) {
  const { weapons, armor, otherDefinitions } = props;

  const weaponsBySlot = groupBy(weapons, (v) => v.inventory?.bucketTypeHash);

  const armorByClass = groupBy(armor, (v) => v.classType ?? -1);

  return (
    <div className={s.root}>
      {/* <div className={s.spoilerDisclaimer}>
        <div className={s.spoilerContent}> spoiler disclaimer</div>
      </div> */}

      <h1>Deep Stone Crypt</h1>

      <br />
      <br />

      <div className={s.weaponBuckets}>
        {Object.entries(armorByClass)
          .sort(([a], [b]) => BUCKET_ORDER.indexOf(a) - BUCKET_ORDER.indexOf(b))
          .map(([classType, armorForClass]) => {
            const className = CLASS_NAME[classType];

            return (
              <div>
                <WeaponHeading>{className}</WeaponHeading>

                <div className={s.gearList}>
                  {armorForClass.map((item) => (
                    <ItemSummary key={item.hash} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      <br />
      <br />
      <br />
      <br />

      <div className={s.weaponBuckets}>
        {Object.entries(weaponsBySlot)
          .sort(([a], [b]) => BUCKET_ORDER.indexOf(a) - BUCKET_ORDER.indexOf(b))
          .map(([bucketHash, weaponsForBucket]) => {
            const bucketDef =
              otherDefinitions.DestinyInventoryBucketDefinition?.[
                bucketHash ?? -1
              ];

            return (
              <div>
                <WeaponHeading>
                  {bucketDef?.displayProperties?.name}
                </WeaponHeading>

                <div className={s.gearList}>
                  {weaponsForBucket.map((item) => (
                    <a
                      className={s.invisibleLink}
                      key={item.hash}
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

      <br />
      <br />
      <br />
      <br />

      {weapons
        .sort((a, b) => (b.index ?? 0) - (a.index ?? 0))
        .map((item) => (
          <div key={item?.hash}>
            <WeaponDetails item={item} otherDefinitions={otherDefinitions} />
          </div>
        ))}
    </div>
  );
}
