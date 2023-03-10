import {
  AllDestinyManifestComponents,
  DestinyInventoryItemDefinition,
} from "@destiny-definitions/common";
import React from "react";
import { getDisplayName } from "../../../lib/utils";
import WeaponHeading from "../WeaponHeading";
import s from "./styles.module.scss";

interface WeaponStatsProps {
  item: DestinyInventoryItemDefinition;
  otherDefinitions: AllDestinyManifestComponents;
}

const WeaponStats: React.FC<WeaponStatsProps> = ({
  item,
  otherDefinitions,
}) => {
  const stats = item.investmentStats;

  if (!stats) {
    return null;
  }

  return (
    <div>
      <WeaponHeading>Base stats</WeaponHeading>

      <table className={s.root}>
        <tbody>
          {stats.map((v, index) => {
            const stat =
              otherDefinitions.DestinyStatDefinition?.[v.statTypeHash ?? -1];

            if (!stat || !v.value) return <tr key={index} />;

            return (
              <tr className={s.stat} key={index}>
                <td className={s.statName}>{getDisplayName(stat)}</td>
                <td className={s.statValue}>{v.value}</td>
                <td>
                  <div className={s.statTrackWrapper}>
                    <div
                      className={s.statTrack}
                      style={{ width: `${Math.min(v.value, 100)}%` }}
                    />
                  </div>
                </td>
                {/* <div className={s.statTrackWrapper}>
              <div
                className={s.statTrack}
                style={{ width: `${v.value}%` }}
              ></div>
            </div> */}
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className={s.disclaimer}>
        <em>
          Stats are the 'base investment stats' which, in game, are modified by
          the intrinsic weapon frame and other perks.
        </em>
      </p>
    </div>
  );
};

export default WeaponStats;
