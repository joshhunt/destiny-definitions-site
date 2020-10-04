import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { pickBy, shuffle } from "lodash";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

import {
  getVersionsIndex,
  getDiffForVersion,
  getDefinitionForVersion,
} from "../../../remote";
import {
  DiffsByVersion,
  AnyDefinitionTable,
  DefinitionDiff,
  ManifestVersion,
} from "../../../types";

import mockDiffData from "./inventoryItemDiff.json";

import DefinitionDiffPage from "../../../components/DefinitionDiffPage";

interface DefinitionDiffStaticProps {
  versionId: string;
  manifestVersion: ManifestVersion;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
}

export default function DefinitionDiffPageWrapper({
  versionId,
  manifestVersion,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
}: DefinitionDiffStaticProps) {
  return (
    <DefinitionDiffPage
      versionId={versionId}
      manifestVersion={manifestVersion}
      definitionName={definitionName}
      diff={diff}
      definitions={definitions}
      previousDefinitions={previousDefinitions}
    />
  );
}

interface Params {
  id: string;
  table: string;
  [key: string]: any;
}

// export const getStaticPaths: GetStaticPaths<Params> = async () => {
//   const data = await getVersionsIndex();
//   if (!data) throw new Error("Unable to get version index");

//   const diffsForVersion: DiffsByVersion = {};

//   for (const versionIndex in data) {
//     const version = data[versionIndex];
//     const diffData = await getDiffForVersion(version.id);

//     diffsForVersion[version.id] = diffData;
//   }

//   const paths = data.flatMap((version) => {
//     const diffData = diffsForVersion[version.id] ?? {};

//     return Object.entries(diffData)
//       .filter(([, diffData]) => Object.values(diffData).some((v) => v.length))
//       .map(([table]) => ({
//         params: {
//           id: version.id,
//           table,
//         },
//       }));
//   });

//   return { paths, fallback: false };
// };

export const getStaticProps: GetStaticProps<
  DefinitionDiffStaticProps,
  Params
> = async (context) => {
  const definitionName = "DestinyInventoryItemDefinition";

  const allVersions = await getVersionsIndex();
  const manifestVersion = allVersions?.[0];

  if (!manifestVersion) {
    throw new Error("missing currentVersionIndex");
  }

  const versionId = manifestVersion?.id;

  const allDefinitionDiffs = await getDiffForVersion(versionId);
  if (!allDefinitionDiffs) throw new Error("missing diff data for table page");

  const diff = mockDiffData;
  const definitions = await getDefinitionForVersion(versionId, definitionName);

  if (!definitions) throw new Error("Definitions is missing");

  const hashesInDiff: number[] = Object.values(diff).flatMap((v) => v); // unsure why Object.values loses type :(
  const pickedDefinitions = pickBy(definitions, (v) =>
    hashesInDiff.includes(v.hash)
  ) as AnyDefinitionTable;

  return {
    props: {
      versionId,
      manifestVersion,
      definitionName,
      diff,
      definitions: pickedDefinitions,
      previousDefinitions: null,
    },
  };
};

export const config = {
  unstable_runtimeJS: false,
};
