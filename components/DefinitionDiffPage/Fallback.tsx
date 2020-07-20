import DiffList from "../DiffList";
import { DefinitionDiff, AnyDefinitionTable } from "../../types";

interface FallbackDiffList {
  versionId: string;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
}

export function FallbackDiff({
  versionId,
  definitionName,
  diff,
  definitions,
}: FallbackDiffList) {
  return (
    <>
      <h2>{definitionName}</h2>

      <DiffList name="Added" hashes={diff.added} definitions={definitions} />
      <DiffList
        name="Unclassified"
        hashes={diff.unclassified}
        definitions={definitions}
      />
      <DiffList
        name="Removed"
        hashes={diff.removed}
        definitions={definitions}
      />
      <DiffList
        name="Reclassified"
        hashes={diff.reclassified}
        definitions={definitions}
      />
    </>
  );
}
