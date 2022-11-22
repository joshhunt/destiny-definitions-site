import { GetStaticPaths, GetStaticProps } from "next";
import ModifiedDiffPage, {
  ModifiedDiffPageProps,
} from "../../../../../components/ModifiedDiffPage";

import { format } from "date-fns";
import { friendlyDiffName, getDisplayName } from "../../../../../lib/utils";
import duration from "../../../../../lib/duration";
import { DefinitionsArchive, S3Archive } from "@destiny-definitions/common";
import { makeMetaProps } from "../../../../../lib/serverUtils";

interface Params {
  [key: string]: any;
  id: string;
  table: string;
  hash: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  ModifiedDiffPageProps,
  Params
> = async (context) => {
  const s3Client = S3Archive.newFromEnvVars();
  const defsClient = DefinitionsArchive.newFromEnvVars(s3Client);
  const versionId = context.params?.id ?? "";
  const tableName = context.params?.table ?? "";
  const hash = context.params?.hash ?? "";

  const previousVersion = await s3Client.getPreviousVersion(versionId);

  if (!previousVersion) {
    throw new Error("Could not find previous version");
  }

  const manifestVersion = await s3Client.getVersion(versionId);

  const definition = await defsClient.getDefinition(
    versionId,
    tableName,
    parseInt(hash)
  );

  const previousDefinition = await defsClient.getDefinition(
    previousVersion.id,
    tableName,
    parseInt(hash)
  );

  const breadcrumbs = [
    manifestVersion && {
      label: format(new Date(manifestVersion.createdAt), "E do MMM, u"),
      to: `/version/${versionId}`,
    },
    {
      label: friendlyDiffName(tableName),
      to: `/version/${versionId}/${tableName}`,
    },
    definition && {
      label: getDisplayName(definition),
      to: `/version/${versionId}/${tableName}/modified/${hash}`,
    },
  ];

  return {
    props: {
      versionId,
      hash,
      definition,
      previousDefinition,
      breadcrumbs,
      meta: makeMetaProps(),
    },
    revalidate: duration("30 days"),
  };
};

export default ModifiedDiffPage;
