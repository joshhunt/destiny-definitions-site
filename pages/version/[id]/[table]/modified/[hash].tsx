import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import ModifiedDiffPage from "../../../../../components/ModifiedDiffPage";
import { getDisplayName } from "../../../../../lib/utils";
import {
  getDefinitionForVersion,
  getDiffForVersion,
  getModifiedDeepDiff,
  getVersionsIndex,
} from "../../../../../remote";
import {
  AnyDefinition,
  DiffsByVersion,
  ModifiedDeepDiffEntry,
} from "../../../../../types";

interface Params {
  [key: string]: any;
  id: string;
  table: string;
  hash: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const data = await getVersionsIndex(true);
  if (!data) throw new Error("Unable to get version index");

  const diffsForVersion: DiffsByVersion = {};

  for (const versionIndex in data) {
    const version = data[versionIndex];
    const diffData = await getDiffForVersion(version.id);

    diffsForVersion[version.id] = diffData;
  }

  const paths = data.flatMap((version) => {
    const diffData = diffsForVersion[version.id] ?? {};

    return Object.entries(diffData)
      .filter(([, diffData]) => Object.values(diffData).some((v) => v.length))
      .flatMap(([table, definitionDiff]) => {
        return definitionDiff.modified.map((modifiedHash) => {
          return {
            params: {
              id: version.id,
              table,
              hash: modifiedHash.toString(),
            },
          };
        });
      });
  });

  return { paths, fallback: false };
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
  const versionId = context.params?.id ?? "";
  const definitionName = context.params?.table ?? "";
  const hash = context.params?.hash ?? "";

  const diffData = await getModifiedDeepDiff(versionId, definitionName);
  const diffForHash = diffData?.[hash as any];

  // const definitions = await getDefinitionForVersion(versionId, definitionName);
  // const definition = definitions[hash];

  return {
    props: {
      versionId,
      hash,
      diffForHash,
      definition: null,
    },
  };
};

export default function ModifiedDiffPageWrapper(props: ModifiedDiffPageProps) {
  return <ModifiedDiffPage {...props} />;
}
