import DiffList from "../DiffList";

import {
  AllDestinyManifestComponents,
  DefinitionTableDiff,
  DefinitionTable,
  ManifestVersion,
  DefinitionTableDiffSummary,
} from "@destiny-definitions/common";
import DefinitionDiffFrame from "../DefinitionDiffFrame";
import ModifiedDiffList from "../DiffList/Modified";
import RemovedDiffList from "../DiffList/Removed";

export interface DefinitionDiffPageProps {
  version: ManifestVersion;
  definitions: DefinitionTable;
  previousDefinitions: DefinitionTable;
  otherDefinitions: AllDestinyManifestComponents;
  tableDiff: DefinitionTableDiff;
  tableDiffSummary: DefinitionTableDiffSummary;
  tableName: string;
  missingTable: boolean;
}

export default function DefinitionDiffPage({
  version,
  definitions,
  previousDefinitions,
  otherDefinitions,
  tableDiff,
  tableDiffSummary,
  tableName,
  missingTable,
}: DefinitionDiffPageProps) {
  return (
    <DefinitionDiffFrame tableName={tableName}>
      {missingTable && (
        <p>
          <em>
            This table is not available in the SQLite definitions database, so
            detailed diff is not available. the SQLite database.
          </em>
        </p>
      )}

      <DiffList
        version={version}
        title="Added"
        diffTypeSlug="added"
        tableName={tableName}
        fullHashCount={tableDiffSummary.added}
        hashes={tableDiff.added}
        definitions={definitions}
        otherDefinitions={otherDefinitions}
      />

      <DiffList
        version={version}
        title="Unclassified"
        diffTypeSlug="unclassified"
        tableName={tableName}
        fullHashCount={tableDiffSummary.unclassified}
        hashes={tableDiff.unclassified}
        definitions={definitions}
        otherDefinitions={otherDefinitions}
      />

      <RemovedDiffList
        version={version}
        title="Removed"
        diffTypeSlug="removed"
        tableName={tableName}
        fullHashCount={tableDiffSummary.removed}
        hashes={tableDiff.removed}
        definitions={previousDefinitions}
        otherDefinitions={{}}
      />

      <RemovedDiffList
        version={version}
        title="Reclassified"
        diffTypeSlug="reclassified"
        tableName={tableName}
        fullHashCount={tableDiffSummary.reclassified}
        hashes={tableDiff.reclassified}
        definitions={previousDefinitions}
        otherDefinitions={{}}
      />

      <ModifiedDiffList
        version={version}
        title="Modified"
        diffTypeSlug="modified"
        tableName={tableName}
        fullHashCount={tableDiffSummary.modified}
        hashes={tableDiff.modified ?? []}
        definitions={definitions}
        otherDefinitions={{}}
      />
    </DefinitionDiffFrame>
  );
}
