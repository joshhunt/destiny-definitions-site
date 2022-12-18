import cx from "classnames";
import React from "react";
import { AllDestinyManifestComponentsTagged } from "../../types";
import BungieImage from "../BungieImage";
import HashLink from "../HashLink";

import s from "./styles.module.scss";

interface CollectibleDiffListProps {
  definitionName: string;
  hashes: number[];
  definitions: AllDestinyManifestComponentsTagged["DestinyCollectibleDefinition"];
}

export default function CollectibleDiffList({
  definitionName,
  hashes,
  definitions,
}: CollectibleDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td>Hash</td>
          <td>Icon</td>
          <td>Name</td>
          <td>Description</td>
          <td>Source</td>
        </tr>
      </thead>

      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];

          if (!def) {
            return (
              <tr key={hash}>
                <td>{hash}</td>
                <td colSpan={4}>Missing data</td>
              </tr>
            );
          }

          return (
            <tr key={hash}>
              <td className={s.shrink}>
                <HashLink hash={hash} definitionName={definitionName} />
              </td>

              <td className={s.shrink}>
                <BungieImage
                  className={s.icon}
                  src={def.displayProperties?.icon}
                  alt={
                    def.displayProperties?.name
                      ? `Icon of "${def.displayProperties?.name}"`
                      : "Icon of this collectible"
                  }
                />
              </td>

              <td className={s.nowrap}>{def.displayProperties?.name}</td>

              <td className={cx(s.prewrap)}>
                {def.displayProperties?.description}
              </td>

              <td className={cx(s.prewrap)}>{def.sourceString}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
