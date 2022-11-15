import DiffList from "../DiffList";

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
        hashes={tableDiff.modified ?? []}
        definitions={definitions}
      />
    </DefinitionDiffFrame>
  );
}