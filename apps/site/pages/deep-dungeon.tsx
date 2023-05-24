import {
  AllDestinyManifestComponents,
  DefinitionsArchive,
  DestinyInventoryItemDefinition,
  S3Archive,
} from "@destiny-definitions/common";
import _, { uniq } from "lodash";
import { GetServerSideProps } from "next";
import S21LootPreview, {
  S21LootPreviewPageProps,
} from "../components/LootPreviews/S21Dungeon";
import { isTableType, notEmpty } from "../lib/utils";

export default S21LootPreview;

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

// RON
const WEAPON_HASHES = [
  1441805468, 839786290, 1757202961, 3262192268, 1125217994,
];

const ARMOR_HASHES = [
  2324998093, 2977663932, 2978918436, 2363472582, 3722748537, 896458489,
  409820272, 42941848, 726878794, 2733403573, 540625098, 587762963, 457617725,
  322717029, 1961182320,
];

const COSMETICS_HASHES = [
  2069797999, // emblem,
  2274944459, // vehicle
];

function deLoreItem(item: DestinyInventoryItemDefinition) {
  if (!item.redacted) {
    return;
  }

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

export const getServerSideProps: GetServerSideProps<
  S21LootPreviewPageProps
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
  const showLore = process.env.SHOW_S21_LORE || false;

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

  const [weapons, armor, cosmetics] = await Promise.all([
    getItems(defsClient, latestVersion.id, WEAPON_HASHES),
    getItems(defsClient, latestVersion.id, ARMOR_HASHES),
    getItems(defsClient, latestVersion.id, COSMETICS_HASHES),
  ]);

  if (!showLore) {
    weapons.forEach(deLoreItem);
    armor.forEach(deLoreItem);
    cosmetics.forEach(deLoreItem);
  }

  cosmetics.push({
    __typeThisPropertyDoesntExist: "DestinyInventoryItemDefinition",
    hash: -1,
    index: -1,
    displayProperties: {
      name: '"Ghoul"',
      icon: "https://destiny-extra-definitions.s3.ap-southeast-2.amazonaws.com/images/investment_globals_client/2DE_1B29.png",
    },
    itemTypeDisplayName: "Seal title",
  });

  const loreHashes = uniq([
    ...armor.map((v) => v.loreHash),
    ...weapons.map((v) => v.loreHash),
    ...cosmetics.map((v) => v.loreHash),
  ])
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
    cosmetics.flatMap((v) => v.perks?.map((v) => v.perkHash))
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

  const breadcrumbs = [{ to: "/s21-dungeon", label: "Ghosts of the Deep" }];

  props = {
    breadcrumbs,
    weapons,
    armor,
    cosmetics,
    otherDefinitions,
  };

  return {
    props,
  };
};
