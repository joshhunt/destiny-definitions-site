import DiffList from "../DiffList";

import {
  AllDestinyManifestComponents,
  DefinitionTableDiff,
  DefinitionTable,
  ManifestVersion,
} from "@destiny-definitions/common";
import DefinitionDiffFrame from "../DefinitionDiffFrame";
import ModifiedDiffList from "../DiffList/Modified";
import RemovedDiffList from "../DiffList/Removed";

interface DefinitionDiffStaticProps {
  version: ManifestVersion;
  definitions: DefinitionTable;
  previousDefinitions: DefinitionTable;
  otherDefinitions: AllDestinyManifestComponents;
  tableDiff: DefinitionTableDiff;
  tableName: string;
}

export default function DefinitionDiffPage({
  version,
  definitions,
  previousDefinitions,
  otherDefinitions,
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
        otherDefinitions={otherDefinitions}
      />

      <DiffList
        title="Unclassified"
        tableName={tableName}
        hashes={tableDiff.unclassified}
        definitions={definitions}
        otherDefinitions={otherDefinitions}
      />

      <RemovedDiffList
        title="Removed"
        tableName={tableName}
        hashes={tableDiff.removed}
        definitions={previousDefinitions}
        otherDefinitions={{}}
      />

      <RemovedDiffList
        title="Reclassified"
        tableName={tableName}
        hashes={tableDiff.reclassified}
        definitions={previousDefinitions}
        otherDefinitions={{}}
      />

      <ModifiedDiffList
        version={version}
        title="Modified"
        tableName={tableName}
        hashes={tableDiff.modified ?? []}
        definitions={definitions}
        otherDefinitions={{}}
      />
    </DefinitionDiffFrame>
  );
}
