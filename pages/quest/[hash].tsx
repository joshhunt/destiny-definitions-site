import { format } from "date-fns";
import { keyBy, mapValues, pick, uniq } from "lodash";
import { GetStaticPaths } from "next";
import React from "react";
import QuestPage, { QuestPageProps } from "../../components/QuestPage";
import {
  createQuestItem,
  createQuestObjective,
  createQuestVendor,
} from "../../components/QuestPage/types";
import duration from "../../lib/duration";
import { getLatestVersion, getTypedDefinition } from "../../remote";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

interface Context {
  params: {
    hash: string;
  };
}

export const getStaticProps = async ({ params }: Context) => {
  const questHash = parseInt(params.hash, 10);
  const version = await getLatestVersion();

  if (!version) {
    throw new Error("Unable to find latest version");
  }

  const [
    itemDefinitions,
    vendorDefinitions,
    objectiveDefinitions,
  ] = await Promise.all([
    getTypedDefinition(version.id, "DestinyInventoryItemDefinition"),
    getTypedDefinition(version.id, "DestinyVendorDefinition"),
    getTypedDefinition(version.id, "DestinyObjectiveDefinition"),
  ]);

  const thisQuest = itemDefinitions[questHash];
  const questName =
    thisQuest?.setData?.questLineName ??
    thisQuest?.displayProperties?.name ??
    "";

  if (!thisQuest) {
    return { notFound: true, revalidate: duration("1 hour") };
  }

  const allQuestDefs =
    thisQuest.setData?.itemList.map((v) => itemDefinitions[v.itemHash]) ?? [];

  const rewardItemHashes = uniq(
    allQuestDefs
      .flatMap((v) => v.value?.itemValue.map((vv) => vv.itemHash))
      .filter((v) => v) ?? []
  );

  const limitedItemHashes = [
    ...rewardItemHashes,
    ...allQuestDefs.map((v) => v.hash),
  ];

  const limitedItemDefs = pick(itemDefinitions, limitedItemHashes);
  const objectiveHashes = allQuestDefs
    .flatMap((v) => v.objectives?.objectiveHashes)
    .filter(nonNullable);

  const limitedObjectiveDefs = pick(objectiveDefinitions, objectiveHashes);

  const relatedVendors = Object.values(vendorDefinitions).filter((v) =>
    v.interactions.some(
      (interaction) =>
        questName && interaction.headerDisplayProperties.name === questName
    )
  );

  const breadcrumbs = [
    {
      label: format(new Date(version.createdAt), "E do MMM, u"),
      to: `/version/${version.id}`,
    },
    {
      label: "Quests",
    },
    {
      label: questName,
      to: `/quest/${questHash}`,
    },
  ];

  return {
    props: {
      breadcrumbs,
      questHash,
      rewardItemHashes: rewardItemHashes,
      itemDefinitions: mapValues(limitedItemDefs, createQuestItem),
      relatedVendors: relatedVendors.map(createQuestVendor),
      objectiveDefinitions: mapValues(
        limitedObjectiveDefs,
        createQuestObjective
      ),
    },
  };
};

const QuestPageWrapper: React.FC<QuestPageProps> = (props) => {
  return <QuestPage {...props} />;
};

export default QuestPageWrapper;

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
