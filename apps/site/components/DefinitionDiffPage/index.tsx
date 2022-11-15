import { friendlyDiffName } from "../../lib/utils";
import DiffList from "../DiffList";
import IndexTable from "../IndexTable";

import s from "./styles.module.scss";
import {
  DefinitionTableDiff,
  GenericDefinitionTable,
  ManifestVersion,
} from "@destiny-definitions/common";
import DefinitionDiffFrame from "../DefinitionDiffFrame";

interface DefinitionDiffStaticProps {
  version: ManifestVersion;
  definitions: GenericDefinitionTable;
  previousDefinitions: GenericDefinitionTable;
  tableDiff: DefinitionTableDiff;
  tableName: string;
}

export default function DefinitionDiffPage({
  version,
  definitions,
  previousDefinitions,
  tableDiff,
  tableName,
}: DefinitionDiffStaticProps) {
  return (
    <DefinitionDiffFrame tableName={tableName}>
      <DiffList
        title="Added"
        tableName={tableName}
        hashes={tableDiff.added}
        definitions={definitions}
      />

      <DiffList
        title="Unclassified"
        tableName={tableName}
        hashes={tableDiff.unclassified}
        definitions={definitions}
      />

      <DiffList
        title="Removed"
        tableName={tableName}
        hashes={tableDiff.removed}
        definitions={previousDefinitions}
      />

      <DiffList
        title="Reclassified"
        tableName={tableName}
        hashes={tableDiff.reclassified}
        definitions={previousDefinitions}
      />

      <DiffList
        title="Modified"
        tableName={tableName}
        hashes={tableDiff.modified}
        definitions={definitions}
      />
    </DefinitionDiffFrame>
  );

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
