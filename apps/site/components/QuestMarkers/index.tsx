import cx from "classnames";
import commonStyles from "../../styles/common.module.scss";
import s from "./styles.module.scss";
import {
  DefinitionTable,
  DestinyInventoryItemDefinition,
  ManifestVersion,
} from "@destiny-definitions/common";

export const QuestStartMarker = () => {
  return <div className={s.start} />;
};

export const QuestMidMarker = () => {
  return <div className={s.mid} />;
};

export const QuestEndMarker = () => {
  return <div className={s.end} />;
};

interface QuestMarkerProps {
  version: ManifestVersion;
  definitions: DefinitionTable<DestinyInventoryItemDefinition>;
  definition: DestinyInventoryItemDefinition;
  siblingDiffHashes: number[];
}

export const QuestMarker: React.FC<QuestMarkerProps> = ({
  version,
  definition,
  definitions,
  siblingDiffHashes,
}) => {
  const questLineItemHash = definition?.objectives?.questlineItemHash ?? 0;
  const questLineItem = definitions[questLineItemHash];

  if (!questLineItem) {
    return <></>;
  }

  const questSteps = questLineItem.setData?.itemList ?? [];

  if (questSteps.length < 2) {
    return <>only {questSteps.length} steps</>;
  }

  const questStartHash = questSteps[0]?.itemHash;
  if (!questStartHash) {
    return <></>;
  }
  const questEndHash = questSteps[questSteps.length - 1]?.itemHash;

  const questStartHashIndex = siblingDiffHashes.indexOf(questStartHash);
  const allStepsPresent = questSteps.every((questStep, index) => {
    return (
      questStep.itemHash === siblingDiffHashes[questStartHashIndex + index]
    );
  });

  if (!allStepsPresent) {
    return (
      <a
        className={cx(commonStyles.link, commonStyles.nobreak)}
        href={`/quest/${version.id}/${definition.hash}`}
      >
        View quest
      </a>
    );
  }

  if (definition.hash === questStartHash) {
    return (
      <div className={s.markerContainer}>
        <a
          className={cx(commonStyles.link, commonStyles.nobreak)}
          href={`/quest/${version.id}/${definition.hash}`}
        >
          View quest
        </a>
        <QuestStartMarker />
      </div>
    );
  }

  if (definition.hash === questEndHash) {
    return (
      <div className={s.markerContainer}>
        <QuestEndMarker />
      </div>
    );
  }

  return (
    <div className={s.markerContainer}>
      <QuestMidMarker />
    </div>
  );
};
