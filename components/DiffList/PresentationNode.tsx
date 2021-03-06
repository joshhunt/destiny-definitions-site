import cx from "classnames";
import React from "react";
import {
  AllDestinyManifestComponentsTagged,
  AnyDefinitionTable,
  DestinyPresentationNodeDefinitionTagged,
} from "../../types";
import BungieImage from "../BungieImage";
import HashLink, { DiffHashLink } from "../HashLink";
import InlineChild from "../InlineEntry";

import s from "./styles.module.scss";
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
        <thead className={s.tableHeader}>
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

            let nextNodeHash = def.parentNodeHashes?.[0];
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
                    alt="Icon"
                  />
                </td>

                <td className={s.nowrap}>
                  {def.displayProperties?.name || <em>No name</em>}
                </td>

                <td>
                  {hierarchy.map((node, index) => (
                    <div
                      className={s.hierarchyItem}
                      key={node.hash}
                      style={{ marginLeft: 16 * index }}
                    >
                      {index !== 0 && <span>↳</span>}{" "}
                      {node.displayProperties.name}
                    </div>
                  ))}

                  <div style={{ marginLeft: 16 * hierarchy.length }}>
                    ↳ <em className={s.faded}>this</em>
                  </div>
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
  const { presentationNodes, records, collectibles, metrics } =
    definition.children || {};

  const {
    DestinyRecordDefinition: recordDefs,
    DestinyCollectibleDefinition: collectibleDefs,
    DestinyMetricDefinition: metricDefs,
  } = otherDefinitions;

  return (
    <>
      <List
        title="Presentation nodes"
        childrenList={presentationNodes ?? []}
        definitions={presentationNodeDefinitions}
        definitionName="DestinyPresentationNodeDefinition"
        selectHash={(child) => child.presentationNodeHash}
      />

      <List
        title="Triumphs"
        childrenList={records ?? []}
        definitions={recordDefs}
        definitionName="DestinyRecordDefinition"
        selectHash={(child) => child.recordHash}
      />

      <List
        title="Collectibles"
        childrenList={collectibles ?? []}
        definitions={collectibleDefs}
        definitionName="DestinyCollectibleDefinition"
        selectHash={(child) => child.collectibleHash}
      />

      <List
        title="Metrics"
        childrenList={metrics ?? []}
        definitions={metricDefs}
        definitionName="DestinyMetricDefinition"
        selectHash={(child) => child.metricHash}
      />
    </>
  );
};

type PresentationNodeChildren =
  | DestinyPresentationNodeChildEntry
  | DestinyPresentationNodeRecordChildEntry
  | DestinyPresentationNodeCollectibleChildEntry
  | DestinyPresentationNodeMetricChildEntry;

interface ListProps<T> {
  title: React.ReactNode;
  childrenList: T[];
  definitionName: string;
  definitions: AnyDefinitionTable | undefined;
  selectHash: (child: T) => number;
}

function List<T extends PresentationNodeChildren>({
  title,
  childrenList,
  definitions,
  definitionName,
  selectHash,
}: ListProps<T>) {
  return childrenList.length > 0 ? (
    <>
      <div className={s.bold}>{title}</div>
      <ul className={s.childList}>
        {childrenList.map((child) => {
          const hash = selectHash(child);

          return (
            <li key={hash} className={s.childItem}>
              <DiffHashLink definitionName={definitionName} hash={hash}>
                <InlineChild definition={definitions?.[hash]} />
              </DiffHashLink>
            </li>
          );
        })}
      </ul>
    </>
  ) : (
    <></>
  );
}
