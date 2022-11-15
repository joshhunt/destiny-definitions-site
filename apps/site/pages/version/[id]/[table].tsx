import { GetStaticProps, GetStaticPaths } from "next";
import invariant from "tiny-invariant";

import React from "react";
import DefinitionDiffPage from "../../../components/DefinitionDiffPage";
import { DiffDataProvider } from "../../../components/diffDataContext";
import duration from "../../../lib/duration";

import {
  DefinitionsArchive,
  DefinitionTableDiff,
  GenericDefinitionTable,
  ManifestVersion,
  S3Archive,
} from "@destiny-definitions/common";

interface DefinitionDiffStaticProps {
  version: ManifestVersion;
  definitions: GenericDefinitionTable;
  previousDefinitions: GenericDefinitionTable;
  tableDiff: DefinitionTableDiff;
  tableName: string;
}

export default function DefinitionDiffPageWrapper(
  props: DefinitionDiffStaticProps
) {
  return <DefinitionDiffPage {...props} />;
}

interface Params {
  id: string;
  table: string;
  diffType?: string;
  [key: string]: any;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  DefinitionDiffStaticProps,
  Params
> = async (context) => {
  const s3Client = S3Archive.newFromEnvVars();
  const defsClient = DefinitionsArchive.newFromEnvVars(s3Client);

  invariant(context.params, "params is required");
  invariant(context.params.id, "versionId param is required");
  invariant(context.params.table, "table param is required");
  const { id: versionId, table: definitionName } = context.params;

  const [manifestVersion, previousManifestVersion] = await Promise.all([
    s3Client.getVersion(versionId),
    s3Client.getPreviousVersion(versionId),
  ]);

  const versionDiff = await s3Client.getVersionDiff(versionId);
  const tableDiff = versionDiff[definitionName];

  const currentHashes = [
    ...tableDiff.added,
    ...tableDiff.unclassified,
    ...(tableDiff.modified ?? []),
  ];

  const removedHashes = previousManifestVersion?.id
    ? [...tableDiff.removed, ...tableDiff.reclassified]
    : [];

  const definitions = await defsClient.getDefinitions(
    versionId,
    definitionName,
    currentHashes
  );

  const previousDefinitions = await defsClient.getDefinitions(
    previousManifestVersion.id,
    definitionName,
    removedHashes
  );

  return {
    props: {
      version: manifestVersion,
      definitions,
      previousDefinitions,
      tableDiff,
      tableName: definitionName,
    },
    revalidate: duration("365 days"),
  };
};

// export const config = {
//   unstable_runtimeJS: false,
// };
