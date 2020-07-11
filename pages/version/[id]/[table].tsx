import {
  DiffsByVersion,
  AnyDefinitionTable,
  DefinitionDiff,
} from "../../../types";
import { GetStaticProps, GetStaticPaths } from "next";
import { pickBy, shuffle } from "lodash";

import {
  getVersionsIndex,
  getDiffForVersion,
  getDefinitionForVersion,
} from "../../../remote";

import React from "react";
import DefinitionDiffPage from "../../../components/DefinitionDiffPage";

interface DefinitionDiffStaticProps {
  versionId: string;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
}

export default function DefinitionDiffPageWrapper({
  versionId,
  definitionName,
  diff,
  definitions,
}: DefinitionDiffStaticProps) {
  return (
    <DefinitionDiffPage
      versionId={versionId}
      definitionName={definitionName}
      diff={diff}
      definitions={definitions}
    />
  );
}

interface Params {
  id: string;
  table: string;
  [key: string]: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const data = await getVersionsIndex();
  if (!data) throw new Error("Unable to get version index");

  const diffsForVersion: DiffsByVersion = {};

  for (const version of data) {
    const diffData = await getDiffForVersion(version.version);
    diffsForVersion[version.version] = diffData;
  }

  const paths = data.flatMap((version) => {
    const diffData = diffsForVersion[version.version] ?? {};

    return Object.entries(diffData)
      .filter(([, diffData]) => Object.values(diffData).some((v) => v.length))
      .map(([table]) => ({
        params: { id: version.version, table },
      }));
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  DefinitionDiffStaticProps,
  Params
> = async (context) => {
  const versionId = context.params?.id ?? "";
  const definitionName = context.params?.table ?? "";

  const allDefinitionDiffs = await getDiffForVersion(versionId);
  if (!allDefinitionDiffs) throw new Error("missing diff data for table page");
  const diff = allDefinitionDiffs[definitionName];

  const definitions = await getDefinitionForVersion(versionId, definitionName);

  // TODO: Remove this before publishing!!!
  if (definitionName === "DestinyInventoryItemDefinition") {
    const weaponHashes = Object.keys(definitions)
      .filter((itemHash) => {
        const itemDef = definitions[itemHash] as any;
        return itemDef.itemCategoryHashes?.includes(1);
      })
      .map((v) => Number(v));

    diff.added.push(...shuffle(weaponHashes).slice(0, 50));
  }

  if (!definitions) throw new Error("Definitions is missing");

  const hashesInDiff: number[] = Object.values(diff).flatMap((v) => v); // unsure why Object.values
  const pickedDefinitions = pickBy(definitions, (v) =>
    hashesInDiff.includes(v.hash)
  ) as AnyDefinitionTable;

  return {
    props: {
      versionId: versionId,
      definitionName,
      diff,
      definitions: pickedDefinitions,
    },
  };
};

export const config = {
  unstable_runtimeJS: false,
};
