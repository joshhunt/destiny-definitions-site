import {
  DefinitionsArchive,
  DefinitionTable,
  S3Archive,
} from "@destiny-definitions/common";
import { uniq } from "lodash";
import { GetStaticPaths } from "next";
import React from "react";
import QuestPage, { QuestPageProps } from "../../components/QuestPage";
import { InteractionRewardSet } from "../../components/QuestPage/types";
import duration from "../../lib/duration";
import notFound from "../../lib/next";
import { getHashAndVersion } from "../../lib/pageUtils";
import { castDefinition, castDefinitionsTable } from "../../lib/utils";
import { DestinyVendorDefinition } from "bungie-api-ts/destiny2";
import log from "../../lib/log";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

interface Context {
  params: {
    hashAndVersion: string[];
  };
}

export const getStaticProps = async ({ params }: Context) => {
  log.info(
    {
      route: "quest/[...hashAndVersion]",
      hashAndVersion: params.hashAndVersion,
    },
    "getStaticProps called"
  );

  const s3Client = S3Archive.newFromEnvVars();
  const { hash: rawQuestHash, version } = await getHashAndVersion(
    s3Client,
    params.hashAndVersion
  );

  const questHash = parseInt(rawQuestHash ?? "", 10);

  if (!questHash || !version) {
    return { notFound: true, revalidate: duration("1 day") };
  }

  const defsClient = DefinitionsArchive.newFromEnvVars(s3Client);

  const itemTableName = "DestinyInventoryItemDefinition";
  const thisQuestDefinitionRaw = await defsClient.getDefinition(
    version.id,
    itemTableName,
    questHash
  );
  const thisQuestDefinition = castDefinition(
    "DestinyInventoryItemDefinition",
    itemTableName,
    thisQuestDefinitionRaw
  );

  const allQuestItemHashes =
    thisQuestDefinition.setData?.itemList
      ?.map((v) => v.itemHash ?? 0)
      .filter(Boolean) ?? [];

  const [questDefsErr, questDefinitionsRaw] = await defsClient.getDefinitions(
    version.id,
    itemTableName,
    allQuestItemHashes
  );
  if (questDefsErr) throw questDefsErr;

  const questDefinitions = castDefinitionsTable(
    "DestinyInventoryItemDefinition",
    itemTableName,
    questDefinitionsRaw
  );

  const allObjectiveHashes = Object.values(questDefinitions)
    .flatMap((v) => v.objectives?.objectiveHashes)
    .filter(nonNullable);

  const objectiveDefinitions = await defsClient.getDefinitions(
    version.id,
    "DestinyObjectiveDefinition",
    allObjectiveHashes
  );

  // TODO: make a way to query definitions using custom SQL to get related vendors
  // TODO: use field queries to lessen definitions

  const vendorDefinitions: DefinitionTable<DestinyVendorDefinition> = {};

  const questName =
    thisQuestDefinition?.setData?.questLineName ??
    thisQuestDefinition?.displayProperties?.name ??
    "";

  if (!thisQuestDefinition) {
    return notFound(duration("1 hour"));
  }

  const allQuestDefs =
    thisQuestDefinition.setData?.itemList?.map(
      (v) => questDefinitions[v.itemHash ?? 0]
    ) ?? [];

  const allRewardItemHashes = allQuestDefs
    .flatMap((v) => v.value?.itemValue?.map((vv) => vv.itemHash))
    .map((v) => v ?? 0)
    .filter((v) => v);

  const rewardItemHashes = uniq(allRewardItemHashes);

  const [rewardDefsErr, rewardItemDefinitions] =
    await defsClient.getDefinitions(
      version.id,
      itemTableName,
      rewardItemHashes
    );

  if (rewardDefsErr) {
    throw rewardDefsErr;
  }

  const limitedItemHashes = uniq([
    questHash,
    ...rewardItemHashes,
    ...allQuestDefs.map((v) => v.hash),
  ]);

  const relatedVendors = Object.values(vendorDefinitions).filter((v) =>
    v.interactions?.some(
      (interaction) =>
        questName && interaction.headerDisplayProperties.name === questName
    )
  );

  const interactionRewards: InteractionRewardSet = {};

  // TODO: need to get rewards from vendors?

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

  // const limitedItemDefs = pick(itemDefinitions, limitedItemHashes);

  const breadcrumbs = [
    {
      date: version.createdAt,
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

  const itemDefs = {
    ...questDefinitions,
    ...castDefinitionsTable(
      "DestinyInventoryItemDefinition",
      itemTableName,
      rewardItemDefinitions
    ),
  };

  return {
    props: {
      breadcrumbs,
      questHash,
      rewardItemHashes: rewardItemHashes,
      itemDefinitions: itemDefs,
      relatedVendors: relatedVendors,
      interactionRewards,
      objectiveDefinitions: objectiveDefinitions,
      meta: { canonical, buildDate: new Date() },
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
