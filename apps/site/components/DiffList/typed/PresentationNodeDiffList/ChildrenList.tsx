import {
  AllDestinyManifestComponents,
  DeepPartial,
  DefinitionTable,
  DestinyPresentationNodeDefinition,
} from "@destiny-definitions/common";
import {
  DestinyPresentationNodeChildEntry,
  DestinyPresentationNodeCollectibleChildEntry,
  DestinyPresentationNodeMetricChildEntry,
  DestinyPresentationNodeRecordChildEntry,
} from "bungie-api-ts/destiny2";
import { DiffHashLink } from "../../../HashLink";
import InlineEntry from "../../../InlineEntry";
import s from "../../styles.module.scss";

interface ChildrenListProps {
  otherDefinitions: AllDestinyManifestComponents;
  definition: DestinyPresentationNodeDefinition;
}

export const ChildrenList: React.FC<ChildrenListProps> = ({
  definition,
  otherDefinitions,
}) => {
  const { presentationNodes, records, collectibles, metrics, craftables } =
    definition.children || {};

  const {
    DestinyRecordDefinition: recordDefs,
    DestinyCollectibleDefinition: collectibleDefs,
    DestinyMetricDefinition: metricDefs,
    DestinyPresentationNodeDefinition: presentationNodeDefs,
    DestinyInventoryItemDefinition: itemDefs,
  } = otherDefinitions;

  return (
    <>
      <List
        title="Presentation nodes"
        childrenList={presentationNodes ?? []}
        definitions={presentationNodeDefs}
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

      <List
        title="Craftables"
        childrenList={craftables ?? []}
        definitions={itemDefs}
        definitionName="DestinyInventoryItemDefinition"
        selectHash={(child) => child.craftableItemHash}
      />
    </>
  );
};

type PresentationNodeChildren =
  | DeepPartial<DestinyPresentationNodeChildEntry>
  | DeepPartial<DestinyPresentationNodeRecordChildEntry>
  | DeepPartial<DestinyPresentationNodeCollectibleChildEntry>
  | DeepPartial<DestinyPresentationNodeMetricChildEntry>;

interface ListProps<T> {
  title: React.ReactNode;
  childrenList: T[];
  definitionName: string;
  definitions: DefinitionTable | undefined;
  selectHash: (child: T) => number | undefined;
}

function List<T extends PresentationNodeChildren>({
  title,
  childrenList,
  definitions,
  definitionName,
  selectHash,
}: ListProps<T>) {
  if (!childrenList?.length) return null;

  return (
    <>
      <div className={s.bold}>{title}</div>
      <ul className={s.childList}>
        {childrenList.map((child) => {
          const hash = selectHash(child);
          if (hash === undefined) {
            return null;
          }

          return (
            <li key={hash} className={s.childItem}>
              <DiffHashLink tableName={definitionName} hash={hash}>
                <InlineEntry definition={definitions?.[hash]} />
              </DiffHashLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}
