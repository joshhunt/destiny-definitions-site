import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import ModifiedDiffPage from "../../../../../components/ModifiedDiffPage";
import {
  getDefinitionForVersion,
  getModifiedDeepDiff,
  getPreviousVersion,
  getVersion,
} from "../../../../../remote";
import { AnyDefinition, ModifiedDeepDiffEntry } from "../../../../../types";

import config from "../../../../../config";
import { format } from "date-fns";
import { friendlyDiffName, getDisplayName } from "../../../../../lib/utils";

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
  previousDefinition: AnyDefinition | null;
}

export const getStaticProps: GetStaticProps<
  ModifiedDiffPageProps,
  Params
> = async (context) => {
  console.log("Running getStaticProps with context", context);
  const versionId = context.params?.id ?? "";
  const definitionName = context.params?.table ?? "";
  const hash = context.params?.hash ?? "";

  const previousVersion = await getPreviousVersion(versionId);

  if (!previousVersion) {
    throw new Error("Could not find previous version");
  }

  const [
    diffData,
    definitions,
    previousDefinitions,
    manifestVersion,
  ] = await Promise.all([
    getModifiedDeepDiff(versionId, definitionName),
    getDefinitionForVersion(versionId, definitionName),
    getDefinitionForVersion(previousVersion.id, definitionName),
    getVersion(versionId),
  ]);

  const diffForHash = diffData?.[hash as any];
  const definition = definitions[hash];
  const previousDefinition = previousDefinitions[hash];

  const breadcrumbs = [
    manifestVersion && {
      label: format(new Date(manifestVersion.createdAt), "E do MMM, u"),
      to: `/version/${versionId}`,
    },
    {
      label: friendlyDiffName(definitionName),
      to: `/version/${versionId}/${definitionName}`,
    },
    definition && {
      label: getDisplayName(definition),
      to: `/version/${versionId}/${definitionName}/modified/${hash}`,
    },
  ];

  return {
    props: {
      versionId,
      hash,
      diffForHash,
      definition,
      previousDefinition,
      breadcrumbs,
    },
    revalidate: 60 * 60,
  };
};

export default function ModifiedDiffPageWrapper(props: ModifiedDiffPageProps) {
  return <ModifiedDiffPage {...props} />;
}
