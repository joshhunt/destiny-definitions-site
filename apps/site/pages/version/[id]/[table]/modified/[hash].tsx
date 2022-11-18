import { GetStaticPaths, GetStaticProps } from "next";
import ModifiedDiffPage, {
  ModifiedDiffPageProps,
} from "../../../../../components/ModifiedDiffPage";
import { getPreviousVersion, getVersion } from "../../../../../remote";

import { format } from "date-fns";
import { friendlyDiffName, getDisplayName } from "../../../../../lib/utils";
import duration from "../../../../../lib/duration";
import gql from "graphql-tag";
import queryGraphql from "../../../../../lib/graphql/queryGraphql";
import {
  QLModifiedDiffPageQuery,
  QLModifiedDiffPageQueryVariables,
} from "../../../../../lib/graphql/types.generated";

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
  const versionId = context.params?.id ?? "";
  const tableName = context.params?.table ?? "";
  const hash = context.params?.hash ?? "";

  const previousVersion = await getPreviousVersion(versionId);

  if (!previousVersion) {
    throw new Error("Could not find previous version");
  }

  const [manifestVersion] = await Promise.all([getVersion(versionId)]);

  const data = await queryGraphql<
    QLModifiedDiffPageQuery,
    QLModifiedDiffPageQueryVariables
  >(QUERY, {
    version: versionId,
    previousVersion: previousVersion.id,
    hash,
    table: tableName,
  });

  const definition = data.definition;
  const previousDefinition = data.previousDefinition;

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
    },
    revalidate: duration("30 days"),
  };
};

export default ModifiedDiffPage;

const QUERY = gql`
  query ModifiedDiffPage(
    $version: String
    $previousVersion: String
    $hash: String
    $table: String
  ) {
    definition: JSONDefinition(version: $version, hash: $hash, table: $table)

    previousDefinition: JSONDefinition(
      version: $previousVersion
      hash: $hash
      table: $table
    )
  }
`;
