import {
  AllDestinyManifestComponents,
  DefinitionsArchive,
  DestinyInventoryItemDefinition,
  DestinyPresentationNodeDefinition,
  DestinyRecordDefinition,
  S3Archive,
} from "@destiny-definitions/common";
import _, { uniq } from "lodash";
import { GetServerSideProps } from "next";
import RootOfNightmaresPage, {
  LoreCollection,
  RootOfNightmaresPageProps,
} from "../components/LootPreviews/RootOfNightmares";
import { isTableType, notEmpty } from "../lib/utils";

export default RootOfNightmaresPage;

const ItemTableName = "DestinyInventoryItemDefinition" as const;
const DamageTableName = "DestinyDamageTypeDefinition" as const;
const StatTableName = "DestinyStatDefinition" as const;
const SocketCategoryTableName = "DestinySocketCategoryDefinition" as const;
const PlugSetTableName = "DestinyPlugSetDefinition" as const;
const BucketTableName = "DestinyInventoryBucketDefinition" as const;
const PerkTableName = "DestinySandboxPerkDefinition" as const;
const LoreTableName = "DestinyLoreDefinition" as const;
const PNodeTableName = "DestinyPresentationNodeDefinition" as const;
const RecordTableName = "DestinyRecordDefinition" as const;

// DSC
// const WEAPON_HASHES = [
//   2399110176, 2990047042, 3366545721, 1392919471, 3281285075, 4248569242,
//   4230965989,
// ];

// const ARMOR_HASHES = [
//   3015085684, 1887490701, 751162931, 2558289743, 2956588906, 893751566,
//   2343515647, 4001862073, 1264765761, 1021060724, 1462908657, 79460168,
//   3975122240, 756445218, 2902277629,
// ];

// RON
const WEAPON_HASHES = [
  3371017761, 484515708, 2972949637, 1491665733, 135029084, 231031173,
  1471212226,
];
const ARMOR_HASHES = [
  3475635982, 630432767, 824228793, 3846650177, 2138394740, 3810243376,
  3608027009, 2787963735, 807905267, 621315878, 4123705451, 2445962586,
  2597227950, 3702434452, 2915322487,
];

const MOD_HASHES = [
  539051925, 1389309840, 1947468772, 4243059257, 2158846614, 1036972936,
  1036972937, 1036972938, 1036972939,
];

const LORE_BOOK_PRESENTATION_NODES = [3269408847];

function deLoreItem(item: DestinyInventoryItemDefinition) {
  if (item.loreHash) {
    (item as any).loreHash = -69;
  }

  if (item.flavorText) {
    (item as any).flavorText = "$$obfuscated";
  }

  if (item.displayProperties?.name) {
    (item as any).displayProperties.name = "$$obfuscated";
  }
}

let props: any = undefined;

async function getItems(
  defsClient: DefinitionsArchive,
  versionId: string,
  itemHashes: number[]
): Promise<DestinyInventoryItemDefinition[]> {
  const [, definitionsObject] = await defsClient.getDefinitions(
    versionId,
    ItemTableName,
    itemHashes
  );

  if (
    !definitionsObject ||
    !isTableType(ItemTableName, ItemTableName, definitionsObject)
  ) {
    throw new Error("error with weapon itemDefs");
  }

  return Object.values(definitionsObject);
}

// async function getLoreBook(
//   defsClient: DefinitionsArchive,
//   versionId: string
// ): Promise<LoreCollection> {
//   const bookPresentationNodeHash = LORE_BOOK_PRESENTATION_NODES[0];

//   const [, _bookNode] = await defsClient.getDefinition(
//     versionId,
//     PNodeTableName,
//     bookPresentationNodeHash
//   );
//   if (!_bookNode) throw new Error("could not get lore presentation node");
//   const bookNode = _bookNode as DestinyPresentationNodeDefinition;

//   const loreRecordHashes =
//     bookNode.children?.records?.map((v) => v.recordHash).filter(notEmpty) ?? [];

//   const [, _recordDefs] = await defsClient.getDefinitions(
//     versionId,
//     RecordTableName,
//     loreRecordHashes
//   );
//   if (!_recordDefs) throw new Error("could not get lore records");
//   const recordDefs = Object.values(_recordDefs) as DestinyRecordDefinition[];

//   const [, _loreDefs] = await defsClient.getDefinitions(
//     versionId,
//     LoreTableName,
//     loreRecordHashes
//   );
//   if (!_loreDefs) throw new Error("could not get lore records");
//   const loreDefs = Object.values(_loreDefs) as DestinyRecordDefinition[];
// }

export const getServerSideProps: GetServerSideProps<
  RootOfNightmaresPageProps
> = async (context) => {
  if (props) {
    context.res.setHeader(
      "Cache-Control",
      "public, s-maxage=500, stale-while-revalidate=500"
    );

    return {
      props,
    };
  }

  const s3Client = S3Archive.newFromEnvVars();
  const defsClient = DefinitionsArchive.newFromEnvVars(s3Client);

  const altDefsUrlBase = process.env.ALT_DEFS_URL_BASE;
  const altDefsUrlPath = process.env.ALT_DEFS_URL_PATH;
  const showLore = process.env.SHOW_LORE || false;

  if (!altDefsUrlBase) {
    throw new Error("ALT_DEFS_URL_BASE not configured");
  }

  if (!altDefsUrlPath) {
    throw new Error("ALT_DEFS_URL_PATH not configured");
  }

  await defsClient.loadAdditionalDefinitions(altDefsUrlBase, altDefsUrlPath);

  const latestVersion = (await s3Client.getVersionHistory()).at(-1);

  if (!latestVersion) {
    throw new Error("Could not get latest version");
  }

  const [weapons, armor, mods] = await Promise.all([
    getItems(defsClient, latestVersion.id, WEAPON_HASHES),
    getItems(defsClient, latestVersion.id, ARMOR_HASHES),
    getItems(defsClient, latestVersion.id, MOD_HASHES),
  ]);

  if (!showLore) {
    weapons.forEach(deLoreItem);
    armor.forEach(deLoreItem);
  }

  const loreHashes = uniq(armor.map((v) => v.loreHash))
    .filter(notEmpty)
    .filter((v) => v);

  const [, loreDefs] = await defsClient.getDefinitions(
    latestVersion.id,
    LoreTableName,
    loreHashes
  );
  if (!loreDefs || !isTableType(LoreTableName, LoreTableName, loreDefs)) {
    throw new Error("error with loreDefs");
  }

  const damageTypeHashes = weapons
    .map((v) => v.defaultDamageTypeHash)
    .filter(notEmpty);

  const [, damageTypeDefs] = await defsClient.getDefinitions(
    latestVersion.id,
    DamageTableName,
    damageTypeHashes
  );

  if (
    !damageTypeDefs ||
    !isTableType(DamageTableName, DamageTableName, damageTypeDefs)
  ) {
    throw new Error("error with damageTypeDefs");
  }

  const allStatHashes = weapons
    .flatMap((v) => v.investmentStats?.map((v) => v.statTypeHash))
    .filter(notEmpty);
  const statHashes = _.uniq(allStatHashes);

  const [, statDefs] = await defsClient.getDefinitions(
    latestVersion.id,
    StatTableName,
    statHashes
  );

  if (!statDefs || !isTableType(StatTableName, StatTableName, statDefs)) {
    throw new Error("error with statDefs");
  }

  const socketCategoryHashes = weapons
    .flatMap((v) =>
      v.sockets?.socketCategories?.map((v) => v.socketCategoryHash)
    )
    .filter(notEmpty);

  const [, socketCategoryDefs] = await defsClient.getDefinitions(
    latestVersion.id,
    SocketCategoryTableName,
    socketCategoryHashes
  );

  if (
    !socketCategoryDefs ||
    !isTableType(
      SocketCategoryTableName,
      SocketCategoryTableName,
      socketCategoryDefs
    )
  ) {
    throw new Error("error with socketCategoryDefs");
  }

  const weaponSockets = weapons
    .flatMap((v) => v.sockets?.socketEntries ?? [])
    .filter(notEmpty);

  const plugSetHashes = weaponSockets.flatMap((v) => {
    const plugSetHashes = [];

    v.reusablePlugSetHash && plugSetHashes.push(v.reusablePlugSetHash);
    v.randomizedPlugSetHash && plugSetHashes.push(v.randomizedPlugSetHash);

    return plugSetHashes;
  });

  const [, plugSetDefs] = await defsClient.getDefinitions(
    latestVersion.id,
    PlugSetTableName,
    plugSetHashes
  );

  if (
    !plugSetDefs ||
    !isTableType(PlugSetTableName, PlugSetTableName, plugSetDefs)
  ) {
    throw new Error("error with plugSetDefs");
  }

  const socketItemDefs = weapons
    .flatMap((v) =>
      v.sockets?.socketEntries?.flatMap((socket) => {
        const itemHashes = [];

        const reusablePlugSet = plugSetDefs[socket.reusablePlugSetHash ?? -1];
        const randomizedPlugSet =
          plugSetDefs[socket.randomizedPlugSetHash ?? -1];

        if (socket.singleInitialItemHash) {
          itemHashes.push(socket.singleInitialItemHash);
        }

        if (reusablePlugSet) {
          itemHashes.push(
            ...(reusablePlugSet.reusablePlugItems?.map((v) => v.plugItemHash) ??
              [])
          );
        }

        if (randomizedPlugSet) {
          itemHashes.push(
            ...(randomizedPlugSet.reusablePlugItems?.map(
              (v) => v.plugItemHash
            ) ?? [])
          );
        }

        return itemHashes;
      })
    )
    .filter(notEmpty);

  const sandboxPerkHashes = uniq(
    mods.flatMap((v) => v.perks?.map((v) => v.perkHash))
  ).filter(notEmpty);

  const [, sandboxPerkDefs] = await defsClient.getDefinitions(
    latestVersion.id,
    PerkTableName,
    sandboxPerkHashes
  );

  if (
    !sandboxPerkDefs ||
    !isTableType(PerkTableName, PerkTableName, sandboxPerkDefs)
  ) {
    throw new Error("error with sandboxPerkDefs");
  }

  const weaponBucketTypeHashes = uniq(
    weapons.map((v) => v.inventory?.bucketTypeHash)
  ).filter(notEmpty);

  const [, bucketTypeDefs] = await defsClient.getDefinitions(
    latestVersion.id,
    BucketTableName,
    weaponBucketTypeHashes
  );

  if (
    !bucketTypeDefs ||
    !isTableType(BucketTableName, BucketTableName, bucketTypeDefs)
  ) {
    throw new Error("error with bucketTypeDefs");
  }

  const [, itemDefs] = await defsClient.getDefinitions(
    latestVersion.id,
    ItemTableName,
    socketItemDefs
  );

  if (!itemDefs || !isTableType(ItemTableName, ItemTableName, itemDefs)) {
    throw new Error("error with itemDefs");
  }

  const otherDefinitions: AllDestinyManifestComponents = {
    [DamageTableName]: damageTypeDefs,
    [StatTableName]: statDefs,
    [SocketCategoryTableName]: socketCategoryDefs,
    [ItemTableName]: itemDefs,
    [PlugSetTableName]: plugSetDefs,
    [BucketTableName]: bucketTypeDefs,
    [PerkTableName]: sandboxPerkDefs,
    [LoreTableName]: loreDefs,
  };

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=500, stale-while-revalidate=500"
  );

  props = {
    weapons,
    armor,
    mods,
    otherDefinitions,
  };

  return {
    props,
  };
};
