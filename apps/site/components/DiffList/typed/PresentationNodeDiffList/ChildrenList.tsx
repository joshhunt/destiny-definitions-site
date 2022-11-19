import {
  AllDestinyManifestComponents,
  DeepPartial,
  DefinitionTable,
  DestinyPresentationNodeDefinition,
  GenericDefinition,
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
  presentationNodeDefinitions: DefinitionTable<DestinyPresentationNodeDefinition>;
  definition: DestinyPresentationNodeDefinition;
}

export const ChildrenList: React.FC<ChildrenListProps> = ({
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
