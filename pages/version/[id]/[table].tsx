import {
  DiffsByVersion,
  AnyDefinitionTable,
  DefinitionDiff,
  ManifestVersion,
  Breadcrumb,
  VersionDiffCounts,
  AllDefinitionDiffs,
  AllDestinyManifestComponentsTagged,
  DefinitionTableName,
} from "../../../types";
import { GetStaticProps, GetStaticPaths } from "next";
import { mapValues, shuffle } from "lodash";

import {
  getVersionsIndex,
  getDiffForVersion,
  getDefinitionForVersion,
} from "../../../remote";

import React from "react";
import DefinitionDiffPage from "../../../components/DefinitionDiffPage";
import { format } from "date-fns";
import definitionsMetadata from "../../../components/definitionsMetadata";
import { DiffDataProvider } from "../../../components/diffDataContext";

interface DefinitionDiffStaticProps {
  versionId: string;
  manifestVersion: ManifestVersion;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
  breadcrumbs: Breadcrumb[];
  versionDiffCounts: VersionDiffCounts;
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
  allDefinitionDiffs: AllDefinitionDiffs;
}

export default function DefinitionDiffPageWrapper({
  versionId,
  manifestVersion,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
  versionDiffCounts,
  otherDefinitions,
  allDefinitionDiffs,
}: DefinitionDiffStaticProps) {
  const contextValue = React.useMemo(
    () => ({
      versionDiff: allDefinitionDiffs,
      versionId,
    }),
    [allDefinitionDiffs, versionId]
  );

  return (
    <DiffDataProvider value={contextValue}>
      <DefinitionDiffPage
        versionId={versionId}
        manifestVersion={manifestVersion}
        definitionName={definitionName}
        diff={diff}
        definitions={definitions}
        previousDefinitions={previousDefinitions}
        versionDiffCounts={versionDiffCounts}
        otherDefinitions={otherDefinitions}
      />
    </DiffDataProvider>
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

    const base = Object.entries(diffData)
      .filter(([, diffData]) => Object.values(diffData).some((v) => v.length))
      .map(([table]) => ({
        params: {
          id: version.id,
          table,
        },
      }));

    if (base.length === 0) {
      return base;
    }

    return [
      ...base,
      // {
      //   params: {
      //     id: version.id,
      //     table: "DestinyVendorDefinition",
      //   },
      // },
    ];
  });

  return { paths, fallback: false };
};

function createDiffCounts(allDefDiffs: AllDefinitionDiffs): VersionDiffCounts {
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

const DEFINITION_DEPENDENCIES: Record<string, DefinitionTableName[]> = {
  DestinyInventoryItemDefinition: [
    "DestinyObjectiveDefinition",
    "DestinyCollectibleDefinition",
  ],

  DestinyPresentationNodeDefinition: [
    "DestinyRecordDefinition",
    "DestinyCollectibleDefinition",
    "DestinyMetricDefinition",
  ],

  DestinyRecordDefinition: ["DestinyObjectiveDefinition"],

  DestinyActivityDefinition: [
    "DestinyDestinationDefinition",
    "DestinyPlaceDefinition",
  ],

  DestinyDestinationDefinition: ["DestinyPlaceDefinition"],

  DestinyVendorDefinition: ["DestinyDestinationDefinition"],
};

async function getDefinitionDependencies(
  versionId: string,
  thisDefinitionName: string
) {
  const dependencies = DEFINITION_DEPENDENCIES[thisDefinitionName] || [];

  const datas = await Promise.all(
    dependencies.map((n) => getDefinitionForVersion(versionId, n))
  );

  const keyed: Record<string, AnyDefinitionTable> = {};

  for (const index in datas) {
    keyed[dependencies[index]] = datas[index];
  }

  return keyed as Partial<AllDestinyManifestComponentsTagged>;
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
  if (!definitions) throw new Error("Definitions is missing");

  // TEST STUFF - START
  // const testHashes = shuffle(definitions)
  //   .slice(0, 100)
  //   .map((h) => h.hash);
  // diff.added = diff.added.concat(testHashes);
  // TEST STUFF - END

  const otherDefinitions = await getDefinitionDependencies(
    versionId,
    definitionName
  );

  const versionDiffCounts = createDiffCounts(allDefinitionDiffs).filter(
    (v) => v.tableName !== definitionName
  );

  const removedHashes = [...diff.removed, ...diff.reclassified];
  const previousDefinitions =
    removedHashes.length > 0 && previousId
      ? await getDefinitionForVersion(previousId, definitionName)
      : null;

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
      definitions,
      previousDefinitions,
      breadcrumbs,
      versionDiffCounts,
      otherDefinitions,
      allDefinitionDiffs,
    },
  };
};

export const config = {
  unstable_runtimeJS: false,
};
