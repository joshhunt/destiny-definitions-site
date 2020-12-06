import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import ModifiedDiffPage from "../../../../../components/ModifiedDiffPage";
import {
  getDefinitionForVersion,
  getModifiedDeepDiff,
} from "../../../../../remote";
import { AnyDefinition, ModifiedDeepDiffEntry } from "../../../../../types";

import config from "../../../../../config";

interface Params {
  [key: string]: any;
  id: string;
  table: string;
  hash: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  if (!config.modifiedDiffPages) {
    return { paths: [], fallback: false };
  }

  return { paths: [], fallback: "blocking" };
};

interface ModifiedDiffPageProps {
  versionId: string;
  hash: string;
  diffForHash: ModifiedDeepDiffEntry | undefined;
  definition: AnyDefinition | null;
}

export const getStaticProps: GetStaticProps<
  ModifiedDiffPageProps,
  Params
> = async (context) => {
  console.log("Running getStaticProps with context", context);
  const versionId = context.params?.id ?? "";
  const definitionName = context.params?.table ?? "";
  const hash = context.params?.hash ?? "";

  const diffData = await getModifiedDeepDiff(versionId, definitionName);
  const diffForHash = diffData?.[hash as any];

  const definitions = await getDefinitionForVersion(versionId, definitionName);
  const definition = definitions[hash];

  return {
    props: {
      versionId,
      hash,
      diffForHash,
      definition,
    },
    revalidate: 60 * 60,
  };
};

export default function ModifiedDiffPageWrapper(props: ModifiedDiffPageProps) {
  return <ModifiedDiffPage {...props} />;
}
