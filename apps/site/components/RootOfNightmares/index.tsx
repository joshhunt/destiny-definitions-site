import {
  AllDestinyManifestComponents,
  DefinitionTable,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import s from "./styles.module.scss";
import WeaponDetails from "./WeaponDetails";

export interface RootOfNightmaresPageProps {
  weapons: DestinyInventoryItemDefinition[];
  otherDefinitions: AllDestinyManifestComponents;
}

export default function RootOfNightmaresPage(props: RootOfNightmaresPageProps) {
  const { weapons, otherDefinitions } = props;

  return (
    <div className={s.root}>
      {/* <div className={s.spoilerDisclaimer}>spoiler disclaimer</div> */}

      <h1>Deek Stone Crypt</h1>

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
