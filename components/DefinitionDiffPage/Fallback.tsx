import DiffList from "../DiffList";
import { DefinitionDiff, AnyDefinitionTable } from "../../types";

interface FallbackDiffList {
  versionId: string;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
}

export function FallbackDiff({
  versionId,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
}: FallbackDiffList) {
  return (
    <>
      <DiffList name="Added" hashes={diff.added} definitions={definitions} />
      <DiffList
        name="Unclassified"
        hashes={diff.unclassified}
        definitions={definitions}
      />
      <DiffList
        name="Removed"
        hashes={diff.removed}
        definitions={previousDefinitions || definitions}
      />
      <DiffList
        name="Reclassified"
        hashes={diff.reclassified}
        definitions={previousDefinitions || definitions}
      />
    </>
  );
}
