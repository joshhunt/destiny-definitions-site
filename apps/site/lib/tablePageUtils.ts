import { DefinitionTableDiff } from "@destiny-definitions/common";
import { mapValues } from "lodash";
import { isValidDiffType } from "./serverUtils";

export const TRUNCATION_LIMIT = 100;

export function createTableDiffForPage(
  diffType: string | undefined,
  fullTableDiff: DefinitionTableDiff
): DefinitionTableDiff {
  if (diffType && isValidDiffType(diffType)) {
    return {
      added: [],
      removed: [],
      unclassified: [],
      reclassified: [],
      modified: [],
      [diffType]: fullTableDiff[diffType] ?? [],
    };
  }

  return mapValues(
    fullTableDiff,
    (hashList) => hashList?.slice(0, TRUNCATION_LIMIT) ?? []
  );
}
