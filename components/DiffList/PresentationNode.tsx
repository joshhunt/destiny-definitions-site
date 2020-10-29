import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import React from "react";
import {
  AllDefinitionDiffs,
  AllDestinyManifestComponentsTagged,
  AnyDefinitionTable,
  DefinitionDiff,
  DestinyPresentationNodeDefinitionTagged,
} from "../../types";
import BungieImage from "../BungieImage";
import HashLink, { DiffHashLink } from "../HashLink";
import InlineChild from "../InlineEntry";
import Interpose from "../Interpose";
import commonStyles from "../../styles/common.module.scss";

import s from "./styles.module.scss";
import { useDiffData } from "../diffDataContext";
import {
  DestinyPresentationNodeChildEntry,
  DestinyPresentationNodeCollectibleChildEntry,
  DestinyPresentationNodeMetricChildEntry,
  DestinyPresentationNodeRecordChildEntry,
} from "bungie-api-ts/destiny2";

interface PresentationNodeDiffListProps {
  definitionName: string;
  hashes: number[];
  definitions: AllDestinyManifestComponentsTagged["DestinyPresentationNodeDefinition"];
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
}

export default function PresentationNodeDiffList({
  definitionName,
  hashes,
  definitions,
  otherDefinitions,
}: PresentationNodeDiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  return (
    <>
      <table className={s.table}>
        <thead>
          <tr>
            <td>Hash</td>
            <td>Icon</td>
            <td>Name</td>
            <td>Hierarchy</td>
            <td>Children</td>
          </tr>
        </thead>

        <tbody>
          {hashes.map((hash) => {
            const def = definitions[hash];

            const hierarchy: DestinyPresentationNodeDefinitionTagged[] = [];

            let nextNodeHash = def.parentNodeHashes[0];
            while (nextNodeHash) {
              const node = definitions[nextNodeHash];

              if (!node) {
                break;
              }

              hierarchy.unshift(node);
              nextNodeHash = node.parentNodeHashes[0];
            }

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
                  />
                </td>

                <td className={s.nowrap}>
                  {def.displayProperties?.name || <em>No name</em>}
                </td>

                <td>
                  <Interpose
                    node={
                      <FontAwesomeIcon
                        className={s.chevronSeperator}
                        icon={faChevronRight}
                      />
                    }
                  >
                    {hierarchy.map((node) => (
                      <span key={node.hash}>{node.displayProperties.name}</span>
                    ))}

                    <span className={s.faded}>
                      <em>this</em>
                    </span>
                  </Interpose>
                </td>

                <td className={cx(s.prewrap)}>
                  <ChildrenList
                    otherDefinitions={otherDefinitions}
                    presentationNodeDefinitions={definitions}
                    definition={def}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

interface ChildrenListProps {
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
  presentationNodeDefinitions: AllDestinyManifestComponentsTagged["DestinyPresentationNodeDefinition"];
  definition: DestinyPresentationNodeDefinitionTagged;
}

const ChildrenList: React.FC<ChildrenListProps> = ({
  definition,
  presentationNodeDefinitions,
  otherDefinitions,
}) => {
  const {
    presentationNodes,
    records,
    collectibles,
    metrics,
  } = definition.children;

  const {
    DestinyRecordDefinition: recordDefs,
    DestinyCollectibleDefinition: collectibleDefs,
    DestinyMetricDefinition: metricDefs,
  } = otherDefinitions;

  return (
    <>
      {presentationNodes.length > 0 && (
        <>
          <div className={s.bold}>Presentation nodes</div>
          <ul className={s.childList}>
            {presentationNodes.map((child) => (
              <li key={child.presentationNodeHash} className={s.childItem}>
                <DiffHashLink
                  definitionName="DestinyPresentationNodeDefinition"
                  hash={child.presentationNodeHash}
                >
                  <InlineChild
                    definition={
                      presentationNodeDefinitions?.[child.presentationNodeHash]
                    }
                  />
                </DiffHashLink>
              </li>
            ))}
          </ul>
        </>
      )}

      {records.length > 0 && (
        <>
          <div className={s.bold}>Triumphs</div>
          <ul className={s.childList}>
            {records.map((child) => (
              <li key={child.recordHash} className={s.childItem}>
                <DiffHashLink
                  definitionName="DestinyRecordDefinition"
                  hash={child.recordHash}
                >
                  <InlineChild definition={recordDefs?.[child.recordHash]} />
                </DiffHashLink>
              </li>
            ))}
          </ul>
        </>
      )}

      {collectibles.length > 0 && (
        <>
          <div className={s.bold}>Collectibles</div>
          <ul className={s.childList}>
            {collectibles.map((child) => (
              <li key={child.collectibleHash} className={s.childItem}>
                <DiffHashLink
                  definitionName="DestinyCollectibleDefinition"
                  hash={child.collectibleHash}
                >
                  <InlineChild
                    definition={collectibleDefs?.[child.collectibleHash]}
                  />
                </DiffHashLink>
              </li>
            ))}
          </ul>
        </>
      )}

      {metrics.length > 0 && (
        <>
          <div className={s.bold}>Metrics</div>
          <ul className={s.childList}>
            {metrics.map((child) => (
              <li key={child.metricHash} className={s.childItem}>
                <DiffHashLink
                  definitionName="DestinyMetricDefinition"
                  hash={child.metricHash}
                >
                  <InlineChild definition={metricDefs?.[child.metricHash]} />
                </DiffHashLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

type PresentationNodeChildren =
  | DestinyPresentationNodeChildEntry
  | DestinyPresentationNodeRecordChildEntry
  | DestinyPresentationNodeCollectibleChildEntry
  | DestinyPresentationNodeMetricChildEntry;

interface ListProps<T = PresentationNodeChildren> {
  childrenList: T[];
  definitionName: keyof AnyDefinitionTable;
  definitions: AnyDefinitionTable;
  selectHash: (child: T) => number;
}

const List: React.FC<ListProps> = ({
  childrenList,
  definitions,
  selectHash,
}) => {
  return (
    <>
      <div className={s.bold}>Triumphs</div>
      <ul className={s.childList}>
        {childrenList.map((child) => {
          const hash = selectHash(child);

          return (
            <DiffHashLink definitionName="DestinyRecordDefinition" hash={hash}>
              <InlineChild definition={definitions?.[hash]} />
            </DiffHashLink>
          );
        })}
      </ul>
    </>
  );
};
