import { GetStaticProps, GetStaticPaths } from "next";
import invariant from "@destiny-definitions/invariant";

import DefinitionDiffPage, {
  DefinitionDiffPageProps,
} from "../../../components/DefinitionDiffPage";
import duration from "../../../lib/duration";

import {
  DefinitionsArchive,
  DefinitionTableDiff,
  DefinitionTable,
  JSONExtractQueryObject,
  S3Archive,
} from "@destiny-definitions/common";
import { isTableType } from "../../../lib/utils";
import { DestinyManifestComponentName } from "bungie-api-ts/destiny2";
import { RPM_STAT_HASH } from "../../../components/ItemSummary/ItemTags";
import {
  permanentlyNotFound,
  makeMetaProps,
  getTableDiffSummary,
  temporaryNotFound,
  isValidDiffType,
} from "../../../lib/serverUtils";
import { MissingDefinitionTable } from "@destiny-definitions/common/src/api/errors";
import { format } from "date-fns";
import { createTableDiffForPage } from "../../../lib/tablePageUtils";

export default DefinitionDiffPage;

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
  DefinitionDiffPageProps,
  Params
> = async (context) => {
  const s3Client = S3Archive.newFromEnvVars();
  const defsClient = DefinitionsArchive.newFromEnvVars(s3Client);

  invariant(context.params, "params is required");
  invariant(context.params.id, "versionId param is required");
  invariant(context.params.table, "table param is required");
  const { id: versionId, table: tableName, diffType } = context.params;

  if (diffType && !isValidDiffType(diffType)) {
    return permanentlyNotFound();
  }

  const [manifestVersion, previousManifestVersion] = await Promise.all([
    s3Client.getVersion(versionId),
    s3Client.getPreviousVersion(versionId),
  ]);

  if (!manifestVersion) {
    return temporaryNotFound();
  }

  const versionDiff = await s3Client.getVersionDiff(versionId);
  const fullTableDiff = versionDiff[tableName];

  if (!fullTableDiff) {
    return permanentlyNotFound();
  }

  const tableDiff = createTableDiffForPage(diffType, fullTableDiff);
  const tableDiffSummary = getTableDiffSummary(fullTableDiff);

  const newHashes = tableDiff.added.concat(tableDiff.unclassified);
  const currentHashes = newHashes.concat(tableDiff.modified ?? []);
  const removedHashes = previousManifestVersion?.id
    ? tableDiff.removed.concat(tableDiff.reclassified)
    : [];

  let missingTable = false;
  let [defsErr, definitions] = await defsClient.getDefinitions(
    versionId,
    tableName,
    currentHashes,
    getFieldsQuery(tableName)
  );

  if (defsErr instanceof MissingDefinitionTable) {
    definitions = {};
    missingTable = true;
  } else if (defsErr instanceof Error || !definitions) {
    throw defsErr;
  }

  const dependencies = getDependencyHashes(tableDiff, tableName, definitions);

  const otherDefinitions = await getMultipleDefinitionTables(
    defsClient,
    versionId,
    dependencies
  );

  let [prevDefsErr, previousDefinitions] = await defsClient.getDefinitions(
    previousManifestVersion.id,
    tableName,
    removedHashes
  );

  if (prevDefsErr instanceof MissingDefinitionTable) {
    previousDefinitions = {};
    missingTable = true;
  } else if (prevDefsErr instanceof Error || !previousDefinitions) {
    throw prevDefsErr;
  }

  // TODO: handle the specific errors (missing db vs missing table) appropriately
  if (previousDefinitions instanceof Error) {
    throw previousDefinitions;
  }

  const tableDiffUrl = `/version/${versionId}/${tableName}`;
  const breadcrumbs = [
    {
      label: format(new Date(manifestVersion.createdAt), "E do MMM, u"),
      to: `/version/${versionId}`,
    },
    {
      label: tableName,
      to: tableDiffUrl,
    },
  ];

  if (diffType) {
    breadcrumbs.push({
      label: capitalizeFirstLetter(diffType),
      to: `${tableDiffUrl}/${diffType}`,
    });
  }

  return {
    props: {
      breadcrumbs,
      version: manifestVersion,
      definitions,
      previousDefinitions,
      otherDefinitions,
      tableDiff,
      tableDiffSummary,
      tableName: tableName,
      missingTable,
      meta: makeMetaProps(),
    },
    revalidate: duration("365 days"),
  };
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

  if (
    isTableType("DestinyPresentationNodeDefinition", tableName, definitions)
  ) {
    for (const hash of newHashes) {
      const def = definitions[hash];

      addHashes(
        deps,
        "DestinyPresentationNodeDefinition",
        def.children?.presentationNodes?.map((v) => v.presentationNodeHash),
        { hash: 1, displayProperties: { name: 1, icon: 1 } }
      );

      addHashes(
        deps,
        "DestinyCollectibleDefinition",
        def.children?.collectibles?.map((v) => v.collectibleHash),
        { hash: 1, displayProperties: { name: 1, icon: 1 } }
      );

      addHashes(
        deps,
        "DestinyRecordDefinition",
        def.children?.records?.map((v) => v.recordHash),
        { hash: 1, displayProperties: { name: 1, icon: 1 } }
      );

      addHashes(
        deps,
        "DestinyMetricDefinition",
        def.children?.metrics?.map((v) => v.metricHash),
        { hash: 1, displayProperties: { name: 1, icon: 1 } }
      );

      addHashes(
        deps,
        "DestinyInventoryItemDefinition",
        def.children?.craftables?.map((v) => v.craftableItemHash),
        { hash: 1, displayProperties: { name: 1, icon: 1 } }
      );

      addHashes(
        deps,
        "DestinyPresentationNodeDefinition",
        def.parentNodeHashes,
        {
          hash: 1,
          displayProperties: {
            name: 1,
            icon: 1,
          },
        }
      );
    }
  }

  if (isTableType("DestinyRecordDefinition", tableName, definitions)) {
    for (const hash of newHashes) {
      const def = definitions[hash];

      addHashes(deps, "DestinyObjectiveDefinition", def.objectiveHashes, {
        hash: 1,
        completionValue: 1,
        progressDescription: 1,
        valueStyle: 1,
      });

      addHashes(
        deps,
        "DestinyObjectiveDefinition",
        def.intervalInfo?.intervalObjectives?.map(
          (v) => v.intervalObjectiveHash
        ),
        {
          hash: 1,
          completionValue: 1,
          progressDescription: 1,
          valueStyle: 1,
        }
      );
    }
  }

  return deps;
}

function addHashes(
  deps: Deps,
  tableName: DestinyManifestComponentName,
  hashInput: number | (number | null | undefined)[] | null | undefined,
  fields: JSONExtractQueryObject
): void {
  if (!hashInput) {
    return;
  }

  const hashes = typeof hashInput === "number" ? [hashInput] : hashInput;
  if (!deps[tableName]) {
    deps[tableName] = { hashes: [], fields };
  }

  const cleanedHashes = hashes
    .filter((v) => v !== null || v !== undefined)
    .map((v) => v ?? 0);

  deps[tableName].hashes.push(...cleanedHashes);
}

async function getMultipleDefinitionTables(
  defsClient: DefinitionsArchive,
  versionId: string,
  toGet: Deps
) {
  const defs: Record<string, DefinitionTable> = {};

  const pairs = Object.entries(toGet);

  for (const [tableName, { hashes, fields }] of pairs) {
    const [err, otherTable] = await defsClient.getDefinitions(
      versionId,
      tableName,
      hashes,
      fields
    );

    if (err) {
      console.warn(err);
      defs[tableName] = {};
    } else {
      defs[tableName] = otherTable;
    }
  }

  return defs;
}

const baseFieldsQuery = {
  hash: 1,
  index: 1,
  displayProperties,
};

function getFieldsQuery(definitionName: string): JSONExtractQueryObject {
  const tableName = definitionName as DestinyManifestComponentName;

  switch (tableName) {
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

    case "DestinyPresentationNodeDefinition":
      return {
        ...baseFieldsQuery,
        children: 1,
        parentNodeHashes: 1,
      };

    case "DestinyRecordDefinition":
      return {
        ...baseFieldsQuery,
        objectiveHashes: 1,
        completionInfo: {
          ScoreValue: 1,
        },
        intervalInfo: {
          intervalObjectives: 1,
        },
      };

    default:
      return baseFieldsQuery;
  }
}

// export const config = {
//   unstable_runtimeJS: false,
// };
