import { AllDestinyManifestComponents } from "bungie-api-ts/destiny2";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import ItemDefinitionPage, {
  ItemDefinitionPageProps,
} from "../../components/ItemDefinitionsPage";
import { getDefinitionForVersion, getVersionsIndex } from "../../remote";

interface Params {
  hash: string;
  [k: string]: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  ItemDefinitionPageProps,
  Params
> = async (context) => {
  const index = [...((await getVersionsIndex()) ?? [])];
  index.reverse();
  const hash = Number(context.params?.hash ?? "");
  const latestVersion = index[0];

  if (!latestVersion) {
    console.warn(`Unable to find latest version`);
    return { notFound: true, revalidate: 60 };
  }

  const definitions = (await getDefinitionForVersion(
    latestVersion.id,
    "DestinyInventoryItemDefinition"
  )) as AllDestinyManifestComponents["DestinyInventoryItemDefinition"];

  console.log("hash:", hash);
  const definition = definitions[hash];

  if (!latestVersion) {
    console.warn(`Unable to find definition for hash ${hash}`);
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: { definition },
    revalidate: 60,
  };
};

const ItemDefinitionPageWrapper: React.FC<ItemDefinitionPageProps> = (
  props
) => {
  return <ItemDefinitionPage {...props} />;
};

export default ItemDefinitionPageWrapper;
