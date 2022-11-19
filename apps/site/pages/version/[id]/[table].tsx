import { GetStaticProps, GetStaticPaths } from "next";
import invariant from "tiny-invariant";

import React from "react";
import DefinitionDiffPage from "../../../components/DefinitionDiffPage";
import duration from "../../../lib/duration";

import {
  AllDestinyManifestComponents,
  DefinitionsArchive,
  DefinitionTableDiff,
  DefinitionTable,
  JSONExtractQueryObject,
  ManifestVersion,
  S3Archive,
} from "@destiny-definitions/common";
import { isTableType } from "../../../lib/utils";
import { DestinyManifestComponentName } from "bungie-api-ts/destiny2";
import { RPM_STAT_HASH } from "../../../components/ItemSummary/ItemTags";

interface DefinitionDiffStaticProps {
  version: ManifestVersion;
  definitions: DefinitionTable;
  previousDefinitions: DefinitionTable;
  otherDefinitions: AllDestinyManifestComponents;
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
  /// @ts-ignore
  tableDiff.modified = [];

  const newHashes = [...tableDiff.added, ...tableDiff.unclassified];
  const currentHashes = [...newHashes, ...(tableDiff.modified ?? [])];
  const removedHashes = previousManifestVersion?.id
    ? [...tableDiff.removed, ...tableDiff.reclassified]
    : [];

  const definitions = await defsClient.getDefinitions(
    versionId,
    definitionName,
    currentHashes,
    getFieldsQuery(definitionName)
  );

  const dependencies = getDependencyHashes(
    tableDiff,
    definitionName,
    definitions
  );

  const otherDefinitions = await getMultipleDefinitionTables(
    defsClient,
    versionId,
    dependencies
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
      otherDefinitions,
      tableDiff,
      tableName: definitionName,
    },
    revalidate: duration("365 days"),
  };
};

type Deps = Record<
  string,
  { hashes: number[]; fields: JSONExtractQueryObject }
>;

const displayProperties = { name: 1, description: 1, icon: 1 };

function getDependencyHashes(
  tableDiff: DefinitionTableDiff,
  tableName: string,
  definitions: DefinitionTable
) {
  const newHashes = tableDiff.added.concat(tableDiff.unclassified);
  const deps: Deps = {};

  if (isTableType("DestinyInventoryItemDefinition", tableName, definitions)) {
    for (const hash of newHashes) {
      const def = definitions[hash];

      addHashes(
        deps,
        "DestinyObjectiveDefinition",
        def.objectives?.objectiveHashes,
        { hash: 1, completionValue: 1, progressDescription: 1, valueStyle: 1 }
      );

      addHashes(deps, "DestinyCollectibleDefinition", def.collectibleHash, {
        hash: 1,
        sourceString: 1,
      });

      const socketSingleInitialItemHashes =
        def.inventory?.tierType === 6 &&
        def.sockets?.socketEntries?.map((v) => v.singleInitialItemHash);
      addHashes(
        deps,
        "DestinyInventoryItemDefinition",
        socketSingleInitialItemHashes || undefined,
        {
          hash: 1,
          uiItemDisplayStyle: 1,
          displayProperties,
        }
      );
    }
  }

  if (isTableType("DestinyActivityDefinition", tableName, definitions)) {
    for (const hash of newHashes) {
      const def = definitions[hash];

      addHashes(deps, "DestinyDestinationDefinition", def.destinationHash, {
        hash: 1,
        displayProperties,
      });

      addHashes(deps, "DestinyPlaceDefinition", def.placeHash, {
        hash: 1,
        displayProperties,
      });
    }
  }

  if (isTableType("DestinyDestinationDefinition", tableName, definitions)) {
    for (const hash of newHashes) {
      const def = definitions[hash];

      addHashes(deps, "DestinyPlaceDefinition", def.placeHash, {
        hash: 1,
        displayProperties: {
          name: 1,
        },
      });
    }
  }

  return deps;
}

function addHashes(
  deps: Deps,
  tableName: DestinyManifestComponentName,
  hashInput: number | number[] | null | undefined,
  fields: JSONExtractQueryObject
): void {
  if (!hashInput) {
    return;
  }

  const hashes = typeof hashInput === "number" ? [hashInput] : hashInput;
  if (!deps[tableName]) {
    deps[tableName] = { hashes: [], fields };
  }

  deps[tableName].hashes.push(...hashes);
}

async function getMultipleDefinitionTables(
  defsClient: DefinitionsArchive,
  versionId: string,
  toGet: Deps
) {
  const defs: Record<string, DefinitionTable> = {};

  const pairs = Object.entries(toGet);

  for (const [tableName, { hashes, fields }] of pairs) {
    defs[tableName] = await defsClient.getDefinitions(
      versionId,
      tableName,
      hashes,
      fields
    );
  }

  return defs;
}

const baseFieldsQuery = {
  hash: 1,
  index: 1,
  displayProperties,
};

function getFieldsQuery(definitionName: string): JSONExtractQueryObject {
  switch (definitionName) {
    case "DestinyInventoryItemDefinition":
      return {
        ...baseFieldsQuery,
        screenshot: 1,
        collectibleHash: 1,
        objectives: {
          objectiveHashes: 1,
        },
        sockets: {
          socketEntries: 1,
        },
        stats: {
          stats: {
            [RPM_STAT_HASH]: {
              value: 1,
            },
          },
        },
        inventory: {
          tierType: 1,
          bucketTypeHash: 1,
        },
        setData: {
          questLineName: 1,
        },
        itemCategoryHashes: 1,
        damageTypes: 1,
        redacted: 1,
        classType: 1,
        itemTypeDisplayName: 1,
        traitIds: 1,
        itemSubType: 1,
        seasonHash: 1,
      };

    case "DestinyActivityDefinition":
      return {
        ...baseFieldsQuery,
        pgcrImage: 1,
        destinationHash: 1,
        placeHash: 1,
        matchmaking: {
          isMatchmade: 1,
          maxPlayers: 1,
          minParty: 1,
          maxParty: 1,
        },
      };

    case "DestinyCollectibleDefinition":
      return {
        ...baseFieldsQuery,
        sourceString: 1,
      };

    case "DestinyDestinationDefinition":
      return {
        ...baseFieldsQuery,
        placeHash: 1,
        bubbleSettings: 1,
      };

    case "DestinyObjectiveDefinition":
      return {
        ...baseFieldsQuery,
        progressDescription: 1,
        completionValue: 1,
      };

    default:
      return baseFieldsQuery;
  }
}

// export const config = {
//   unstable_runtimeJS: false,
// };
