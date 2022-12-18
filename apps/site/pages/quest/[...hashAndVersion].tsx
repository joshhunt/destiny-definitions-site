import { format } from "date-fns";
import { keyBy, mapValues, pick, uniq } from "lodash";
import { GetStaticPaths } from "next";
import React from "react";
import QuestPage, { QuestPageProps } from "../../components/QuestPage";
import {
  createQuestItem,
  createQuestObjective,
  createQuestVendor,
  InteractionRewardSet,
} from "../../components/QuestPage/types";
import duration from "../../lib/duration";
import notFound from "../../lib/next";
import { getHashAndVersion } from "../../lib/pageUtils";
import { getLatestVersion, getTypedDefinition, getVersion } from "../../remote";
import { ManifestVersion } from "../../types";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

interface Context {
  params: {
    hashAndVersion: string[];
  };
}

export const getStaticProps = async ({ params }: Context) => {
  const { hash: rawQuestHash, version } = await getHashAndVersion(
    params.hashAndVersion
  );

  const questHash = parseInt(rawQuestHash ?? "", 10);

  if (!questHash || !version) {
    return { notFound: true, revalidate: duration("1 day") };
  }

  const [itemDefinitions, vendorDefinitions, objectiveDefinitions] =
    await Promise.all([
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
    return notFound(duration("1 hour"));
  }

  const allQuestDefs =
    thisQuest.setData?.itemList.map((v) => itemDefinitions[v.itemHash]) ?? [];

  const rewardItemHashes = uniq(
    allQuestDefs
      .flatMap((v) => v.value?.itemValue.map((vv) => vv.itemHash))
      .filter((v) => v) ?? []
  );

  const limitedItemHashes = uniq([
    questHash,
    ...rewardItemHashes,
    ...allQuestDefs.map((v) => v.hash),
  ]);

  const objectiveHashes = allQuestDefs
    .flatMap((v) => v.objectives?.objectiveHashes)
    .filter(nonNullable);

  const limitedObjectiveDefs = pick(objectiveDefinitions, objectiveHashes);

  const relatedVendors = Object.values(vendorDefinitions).filter((v) =>
    v.interactions?.some(
      (interaction) =>
        questName && interaction.headerDisplayProperties.name === questName
    )
  );

  const interactionRewards: InteractionRewardSet = {};

  for (const vendor of relatedVendors) {
    interactionRewards[vendor.hash] = interactionRewards[vendor.hash] ?? {};

    for (const interaction of vendor.interactions) {
      interactionRewards[vendor.hash][interaction.interactionIndex] =
        interactionRewards[vendor.hash][interaction.interactionIndex] ?? [];

      if (questName && interaction.headerDisplayProperties.name === questName) {
        const vendorCategory =
          vendor.categories[interaction.vendorCategoryIndex];
        const rewardsCategory =
          vendor.categories[interaction.rewardVendorCategoryIndex];

        const itemIndexes = [
          ...(vendorCategory?.vendorItemIndexes ?? []),
          ...(rewardsCategory?.vendorItemIndexes ?? []),
        ];

        const itemHashes = itemIndexes.map(
          (index) => vendor.itemList[index].itemHash
        );
        limitedItemHashes.push(...itemHashes);
        interactionRewards[vendor.hash][interaction.interactionIndex].push(
          ...itemHashes
        );
      }
    }
  }

  const limitedItemDefs = pick(itemDefinitions, limitedItemHashes);

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

  const canonical = `/quest/${version.id}/${questHash}`;

  return {
    props: {
      breadcrumbs,
      questHash,
      rewardItemHashes: rewardItemHashes,
      itemDefinitions: mapValues(limitedItemDefs, createQuestItem),
      relatedVendors: relatedVendors.map(createQuestVendor),
      interactionRewards,
      objectiveDefinitions: mapValues(
        limitedObjectiveDefs,
        createQuestObjective
      ),
      meta: { canonical },
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
