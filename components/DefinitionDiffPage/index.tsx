import {
  DefinitionDiff,
  AnyDefinitionTable,
  ManifestVersion,
  ItemCategoryValues,
  VersionDiffCounts,
  AllDestinyManifestComponentsTagged,
} from "../../types";
import { friendlyDiffName } from "../../lib/utils";
import DiffList from "../DiffList";
import { doGrouping } from "./categorise";
import IndexTable from "../IndexTable";

import s from "./styles.module.scss";

interface DefinitionDiffStaticProps {
  versionId: string;
  manifestVersion: ManifestVersion;
  definitionName: string;
  specificDiffType: string | undefined;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
  versionDiffCounts: VersionDiffCounts;
  otherDefinitions: Partial<AllDestinyManifestComponentsTagged>;
}

export default function DefinitionDiffPage({
  versionId,
  manifestVersion,
  specificDiffType,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
  versionDiffCounts,
  otherDefinitions,
}: DefinitionDiffStaticProps) {
  const TRUNCATION_LIMIT = 100;

  const groupedDiff = doGrouping(
    diff,
    definitions,
    previousDefinitions,
    definitionName
  );

  const indexData = Object.entries(groupedDiff)
    .map(([diffSectionName, groupedHashes]) => {
      return {
        name: diffSectionName,
        count: Array.isArray(groupedHashes)
          ? groupedHashes.length
          : Object.values(groupedHashes).reduce((acc, n) => acc + n.length, 0),
        subItems: Array.isArray(groupedHashes)
          ? null
          : Object.entries(groupedHashes)
              .map(([itemCategory, hashes]) => {
                return {
                  name: itemCategory,
                  count: hashes.length,
                };
              })
              .sort((a, b) => {
                return (
                  ItemCategoryValues.indexOf(a.name) -
                  ItemCategoryValues.indexOf(b.name)
                );
              }),
      };
    })
    .filter((v) => v.count > 0);

  const modified = Array.isArray(groupedDiff.modified)
    ? groupedDiff.modified.slice(0, TRUNCATION_LIMIT)
    : truncateObject(groupedDiff.modified, TRUNCATION_LIMIT);

  return (
    <div className={s.root}>
      <div className={s.main}>
        <h2 className={s.pageTitle}>{friendlyDiffName(definitionName)}</h2>

        {(!specificDiffType || specificDiffType == "added") && (
          <DiffList
            name="Added"
            diffType="added"
            hashes={groupedDiff.added}
            definitions={definitions}
            definitionName={definitionName}
            otherDefinitions={otherDefinitions}
            versionId={versionId}
          />
        )}

        {(!specificDiffType || specificDiffType == "unclassified") && (
          <DiffList
            name="Unclassified"
            diffType="unclassified"
            hashes={groupedDiff.unclassified}
            definitions={definitions}
            definitionName={definitionName}
            otherDefinitions={otherDefinitions}
            versionId={versionId}
          />
        )}

        {(!specificDiffType || specificDiffType == "removed") && (
          <DiffList
            name="Removed"
            diffType="removed"
            hashes={groupedDiff.removed}
            definitions={previousDefinitions || definitions}
            definitionName={definitionName}
            otherDefinitions={otherDefinitions}
            versionId={versionId}
            useFallback
          />
        )}

        {(!specificDiffType || specificDiffType == "reclassified") && (
          <DiffList
            name="Reclassified"
            diffType="reclassified"
            hashes={groupedDiff.reclassified}
            definitions={previousDefinitions || definitions}
            definitionName={definitionName}
            otherDefinitions={otherDefinitions}
            versionId={versionId}
            useFallback
          />
        )}

        {(!specificDiffType || specificDiffType == "modified") && (
          <DiffList
            name="Modified"
            diffType="modified"
            hashes={specificDiffType ? groupedDiff.modified : modified}
            definitions={previousDefinitions || definitions}
            definitionName={definitionName}
            otherDefinitions={otherDefinitions}
            versionId={versionId}
            isTruncated={
              !specificDiffType && diff.modified.length > TRUNCATION_LIMIT
            }
            useModified
          />
        )}
      </div>

      <div className={s.side}>
        <div className={s.stickySide}>
          <IndexTable
            versionId={versionId}
            data={indexData}
            versionDiffCounts={versionDiffCounts}
          />
        </div>
      </div>
    </div>
  );
}

function truncateObject(
  obj: Record<string, number[]>,
  limit: number
): Record<string, number[]> {
  const newObj: Record<string, number[]> = {};

  let total = 0;
  for (const [key, hashes] of Object.entries(obj)) {
    const remaining = limit - total;
    if (remaining <= 0) {
      break;
    }

    newObj[key] = hashes.slice(0, remaining);
    total += newObj[key].length;
  }

  return newObj;
}
