import {
  DiffsByVersion,
  AnyDefinitionTable,
  DefinitionDiff,
  ManifestVersion,
  Breadcrumb,
  VersionDiffCounts,
  AllDefinitionDiffs,
} from "../../../types";
import { GetStaticProps, GetStaticPaths } from "next";
import { mapValues, pickBy } from "lodash";

import {
  getVersionsIndex,
  getDiffForVersion,
  getDefinitionForVersion,
} from "../../../remote";

import React from "react";
import DefinitionDiffPage from "../../../components/DefinitionDiffPage";
import { format } from "date-fns";
import definitionsMetadata from "../../../components/definitionsMetadata";

interface DefinitionDiffStaticProps {
  versionId: string;
  manifestVersion: ManifestVersion;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
  breadcrumbs: Breadcrumb[];
  versionDiffCounts: VersionDiffCounts;
}

export default function DefinitionDiffPageWrapper({
  versionId,
  manifestVersion,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
  versionDiffCounts,
}: DefinitionDiffStaticProps) {
  return (
    <DefinitionDiffPage
      versionId={versionId}
      manifestVersion={manifestVersion}
      definitionName={definitionName}
      diff={diff}
      definitions={definitions}
      previousDefinitions={previousDefinitions}
      versionDiffCounts={versionDiffCounts}
    />
  );
}

interface Params {
  id: string;
  table: string;
  [key: string]: any;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const data = await getVersionsIndex();
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
      .map(([table]) => ({
        params: {
          id: version.id,
          table,
        },
      }));
  });

  return { paths, fallback: false };
};

function createDiffCouts(
  allDefDiffs: AllDefinitionDiffs,
  excludeTable?: string
): VersionDiffCounts {
  return Object.entries(allDefDiffs)
    .sort(([tableNameA], [tableNameB]) => {
      const aIndex = definitionsMetadata[tableNameA].index;
      const bIndex = definitionsMetadata[tableNameB].index;

      return aIndex - bIndex;
    })
    .filter(([tableName, diffs]) =>
      Object.values(diffs).some((vv) => vv.length > 0)
    )
    .map(([tableName, diffs]) => ({
      tableName,
      ...mapValues(diffs, (v) => v.length),
    }));
}

export const getStaticProps: GetStaticProps<
  DefinitionDiffStaticProps,
  Params
> = async (context) => {
  const versionId = context.params?.id ?? "";
  const definitionName = context.params?.table ?? "";

  const allVersions = await getVersionsIndex();
  const currentVersionIndex = allVersions?.findIndex((v) => v.id === versionId);
  const previousId =
    currentVersionIndex &&
    allVersions &&
    allVersions[currentVersionIndex - 1].id;

  const manifestVersion = currentVersionIndex
    ? allVersions?.[currentVersionIndex]
    : undefined;

  if (!manifestVersion) {
    throw new Error(`Unable to find manifestVersion for version ${versionId}`);
  }

  const allDefinitionDiffs = await getDiffForVersion(versionId);
  if (!allDefinitionDiffs) throw new Error("missing diff data for table page");
  const diff = allDefinitionDiffs[definitionName];
  const definitions = await getDefinitionForVersion(versionId, definitionName);

  const versionDiffCounts = createDiffCouts(allDefinitionDiffs);

  const removedHashes = [...diff.removed, ...diff.reclassified];
  const previousDefinitions =
    removedHashes.length > 0 && previousId
      ? await getDefinitionForVersion(previousId, definitionName)
      : null;

  if (!definitions) throw new Error("Definitions is missing");

  const hashesInDiff: number[] = Object.values(diff).flatMap((v) => v); // unsure why Object.values loses type :(
  const pickedDefinitions = pickBy(definitions, (v) =>
    hashesInDiff.includes(v.hash)
  ) as AnyDefinitionTable;

  const prevPickedDefinitions =
    previousDefinitions &&
    (pickBy(previousDefinitions, (v) =>
      removedHashes.includes(v.hash)
    ) as AnyDefinitionTable);

  const breadcrumbs = [
    {
      label: format(new Date(manifestVersion.createdAt), "E do MMM, u"),
      to: `/version/${versionId}`,
    },
  ];

  return {
    props: {
      versionId,
      manifestVersion,
      definitionName,
      diff,
      definitions: pickedDefinitions,
      previousDefinitions: prevPickedDefinitions || null,
      breadcrumbs,
      versionDiffCounts,
    },
  };
};

export const config = {
  unstable_runtimeJS: false,
};
