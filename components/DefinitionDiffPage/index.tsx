import { pickBy } from "lodash";

import s from "./styles.module.scss";
import {
  DefinitionDiff,
  AnyDefinitionTable,
  ManifestVersion,
} from "../../types";
import { FallbackDiff } from "./Fallback";
import { InventoryItemDiff } from "./InventoryItem";
import { format } from "date-fns";
import { friendlyDiffName } from "../../lib/utils";

interface DefinitionDiffStaticProps {
  versionId: string;
  manifestVersion: ManifestVersion;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
}

function ContentForDefinitionType({
  versionId,
  manifestVersion,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
}: DefinitionDiffStaticProps) {
  const zeroth: number = Object.values(diff).find((v) => v[0])[0];
  const def = definitions[zeroth];

  switch (definitionName) {
    case "DestinyInventoryItemDefinition":
      return (
        <InventoryItemDiff
          versionId={versionId}
          manifestVersion={manifestVersion}
          definitionName={definitionName}
          diff={diff}
          definitions={definitions}
          previousDefinitions={previousDefinitions}
        />
      );

    default:
      return (
        <FallbackDiff
          versionId={versionId}
          definitionName={definitionName}
          diff={diff}
          definitions={definitions}
          previousDefinitions={previousDefinitions}
        />
      );
  }
}

export default function DefinitionDiffPage({
  versionId,
  manifestVersion,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
}: DefinitionDiffStaticProps) {
  return (
    <div className={s.root}>
      <h2>
        {friendlyDiffName(definitionName)},{" "}
        {format(new Date(manifestVersion.createdAt), "E do MMM, u")}
      </h2>

      <p>Bungie version {versionId}</p>

      <ContentForDefinitionType
        versionId={versionId}
        manifestVersion={manifestVersion}
        definitionName={definitionName}
        diff={diff}
        definitions={definitions}
        previousDefinitions={previousDefinitions}
      />
    </div>
  );
}
