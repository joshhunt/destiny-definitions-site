import { pickBy } from "lodash";

import s from "./styles.module.scss";
import { DefinitionDiff, AnyDefinitionTable } from "../../types";
import DiffList from "../DiffList";
import { FallbackDiff } from "./Fallback";
import { InventoryItemDiff } from "./InventoryItem";

interface DefinitionDiffStaticProps {
  versionId: string;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
}

function ContentForDefinitionType({
  versionId,
  definitionName,
  diff,
  definitions,
}: DefinitionDiffStaticProps) {
  const zeroth: number = Object.values(diff).find((v) => v[0])[0];
  const def = definitions[zeroth];

  switch (def?.__type) {
    case "DestinyInventoryItemDefinition":
      return (
        <InventoryItemDiff
          versionId={versionId}
          definitionName={definitionName}
          diff={diff}
          definitions={definitions}
        />
      );

    default:
      return (
        <FallbackDiff
          versionId={versionId}
          definitionName={definitionName}
          diff={diff}
          definitions={definitions}
        />
      );
  }
}

export default function DefinitionDiffPage({
  versionId,
  definitionName,
  diff,
  definitions,
}: DefinitionDiffStaticProps) {
  return (
    <div className={s.root}>
      <h1>Release July 7 2020</h1>

      <p>Bungie version {versionId}</p>

      <ContentForDefinitionType
        versionId={versionId}
        definitionName={definitionName}
        diff={diff}
        definitions={definitions}
      />
    </div>
  );
}
