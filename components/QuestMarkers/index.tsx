import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { useDiffData } from "../diffDataContext";
import cx from "classnames";
import commonStyles from "../../styles/common.module.scss";
import s from "./styles.module.scss";
import { AllDestinyManifestComponentsTagged } from "../../types";

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
  definitions: AllDestinyManifestComponentsTagged["DestinyInventoryItemDefinition"];
  definition: DestinyInventoryItemDefinition;
  siblingDiffHashes: number[];
}

export const QuestMarker: React.FC<QuestMarkerProps> = ({
  definition,
  definitions,
  siblingDiffHashes,
}) => {
  const diffData = useDiffData();
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
        href={`/quest/${diffData.versionId}/${definition.hash}`}
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
          href={`/quest/${diffData.versionId}/${definition.hash}`}
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
