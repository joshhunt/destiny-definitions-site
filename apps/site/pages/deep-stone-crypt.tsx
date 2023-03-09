import {
  AllDestinyManifestComponents,
  DefinitionsArchive,
  S3Archive,
} from "@destiny-definitions/common";
import _, { uniq } from "lodash";
import { GetServerSideProps, GetStaticProps } from "next";
import RootOfNightmaresPage, {
  RootOfNightmaresPageProps,
} from "../components/RootOfNightmares";
import { isTableType, notEmpty } from "../lib/utils";

export default RootOfNightmaresPage;

const ItemTableName = "DestinyInventoryItemDefinition" as const;
const DamageTableName = "DestinyDamageTypeDefinition" as const;
const StatTableName = "DestinyStatDefinition" as const;
const SocketCategoryTableName = "DestinySocketCategoryDefinition" as const;
const PlugSetTableName = "DestinyPlugSetDefinition" as const;
const BucketTableName = "DestinyInventoryBucketDefinition" as const;

const WEAPON_HASHES = [
  2399110176, 2990047042, 3366545721, 1392919471, 3281285075, 4248569242,
  4230965989,
];

const ARMOR_HASHES = [
  3015085684, 1887490701, 751162931, 2558289743, 2956588906, 893751566,
  2343515647, 4001862073, 1264765761, 1021060724, 1462908657, 79460168,
  3975122240, 756445218, 2902277629,
];

export const getServerSideProps: GetServerSideProps<
  RootOfNightmaresPageProps
> = async () => {
  const s3Client = S3Archive.newFromEnvVars();
  const defsClient = DefinitionsArchive.newFromEnvVars(s3Client);

  const latestVersion = (await s3Client.getVersionHistory()).at(-1);
  console.log(latestVersion);

  if (!latestVersion) {
    throw new Error("Could not get latest version");
  }

  const [, _weapons] = await defsClient.getDefinitions(
    latestVersion.id,
    ItemTableName,
    WEAPON_HASHES
  );

  if (!_weapons || !isTableType(ItemTableName, ItemTableName, _weapons)) {
    throw new Error("error with weapon itemDefs");
  }
  const weapons = Object.values(_weapons);

  const [, _armor] = await defsClient.getDefinitions(
    latestVersion.id,
    ItemTableName,
    ARMOR_HASHES
  );
  if (!_armor || !isTableType(ItemTableName, ItemTableName, _armor)) {
    throw new Error("error with armor itemDefs");
  }
  const armor = Object.values(_armor);

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
  };

  return {
    props: {
      weapons,
      armor,
      otherDefinitions,
    },
  };
};
