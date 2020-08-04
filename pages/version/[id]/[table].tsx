import {
  DiffsByVersion,
  AnyDefinitionTable,
  DefinitionDiff,
} from "../../../types";
import { GetStaticProps, GetStaticPaths } from "next";
import { pickBy } from "lodash";

import {
  getVersionsIndex,
  getDiffForVersion,
  getDefinitionForVersion,
} from "../../../remote";

import React from "react";
import DefinitionDiffPage from "../../../components/DefinitionDiffPage";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

interface DefinitionDiffStaticProps {
  versionId: string;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
}

export default function DefinitionDiffPageWrapper({
  versionId,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
}: DefinitionDiffStaticProps) {
  return (
    <DefinitionDiffPage
      versionId={versionId}
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

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const data = await getVersionsIndex();
  if (!data) throw new Error("Unable to get version index");

  const diffsForVersion: DiffsByVersion = {};

  for (const versionIndex in data) {
    const version = data[versionIndex];
    const diffData = await getDiffForVersion(version.version);

    diffsForVersion[version.version] = diffData;
  }

  const paths = data.flatMap((version) => {
    const diffData = diffsForVersion[version.version] ?? {};

    return Object.entries(diffData)
      .filter(([, diffData]) => Object.values(diffData).some((v) => v.length))
      .map(([table]) => ({
        params: {
          id: version.version,
          table,
        },
      }));
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  DefinitionDiffStaticProps,
  Params
> = async (context) => {
  const versionId = context.params?.id ?? "";
  // const previousId = context.params?.previousVersionId ?? null;
  const definitionName = context.params?.table ?? "";

  const allVersions = await getVersionsIndex();
  const currentVersionIndex = allVersions?.findIndex(
    (v) => v.version === versionId
  );
  const previousId =
    currentVersionIndex &&
    allVersions &&
    allVersions[currentVersionIndex - 1].version;

  const allDefinitionDiffs = await getDiffForVersion(versionId);
  if (!allDefinitionDiffs) throw new Error("missing diff data for table page");
  const diff = allDefinitionDiffs[definitionName];
  const definitions = await getDefinitionForVersion(versionId, definitionName);

  const removedHashes = [...diff.removed, ...diff.reclassified];
  const previousDefinitions =
    removedHashes.length > 0 && previousId
      ? await getDefinitionForVersion(previousId, definitionName)
      : null;

  console.log({
    condition: removedHashes.length > 0 && previousId,
    previousId,
    removedHashes,
    previousDefinitions: `${
      Object.keys(previousDefinitions || {}).length
    } keys`,
  });

  // // TODO: Remove this before publishing!!!
  // if (definitionName === "DestinyInventoryItemDefinition") {
  //   const weaponHashes = Object.keys(definitions)
  //     .filter((itemHash) => {
  //       // const itemDef = definitions[itemHash] as DestinyInventoryItemDefinition;
  //       // return itemDef.itemCategoryHashes?.includes(1);
  //       return true;
  //     })
  //     .map((v) => Number(v));

  //   diff.added.push(...shuffle(weaponHashes).slice(0, 5000));

  //   // const redacted = Object.keys(definitions)
  //   //   .filter((itemHash) => {
  //   //     const itemDef = definitions[itemHash] as DestinyInventoryItemDefinition;
  //   //     return itemDef.redacted ? true : false;
  //   //   })
  //   //   .map((v) => Number(v));

  //   // diff.unclassified.push(...shuffle(redacted));
  // }

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

  return {
    props: {
      versionId: versionId,
      definitionName,
      diff,
      definitions: pickedDefinitions,
      previousDefinitions: prevPickedDefinitions || null,
    },
  };
};

export const config = {
  unstable_runtimeJS: false,
};
