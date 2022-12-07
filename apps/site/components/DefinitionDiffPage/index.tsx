import DiffList from "../DiffList";

import {
  AllDestinyManifestComponents,
  DefinitionTableDiff,
  DefinitionTable,
  ManifestVersion,
  DefinitionTableDiffSummary,
  VersionDiffSummary,
} from "@destiny-definitions/common";
import s from "./styles.module.scss";
import Aside from "../Aside";
import { friendlyTableName } from "../../lib/utils";
import IndexTable from "../IndexTable";
import { getTableDiffSummary } from "../../lib/serverUtils";

export interface DefinitionDiffPageProps {
  version: ManifestVersion;
  definitions: DefinitionTable;
  previousDefinitions: DefinitionTable;
  otherDefinitions: AllDestinyManifestComponents;
  tableDiff: DefinitionTableDiff;
  tableDiffSummary: DefinitionTableDiffSummary;
  versionDiffSummary: VersionDiffSummary;
  tableName: string;
  missingTable: boolean;
}

export default function DefinitionDiffPage({
  version,
  definitions,
  previousDefinitions,
  otherDefinitions,
  tableDiff,
  versionDiffSummary,
  tableName,
  missingTable,
}: DefinitionDiffPageProps) {
  const tableDiffSummary = versionDiffSummary[tableName];
  const thisPageTableDiffSummary = getTableDiffSummary(tableDiff);

  return (
    <div className={s.root}>
      <div className={s.main}>
        <h2 className={s.pageTitle}>{friendlyTableName(tableName)}</h2>
        {missingTable && (
          <Aside>
            This table is not available in the SQLite definitions database, so
            detailed diff is not available.
          </Aside>
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

        <DiffList
          version={version}
          title="Removed"
          diffTypeSlug="removed"
          tableName={tableName}
          fullHashCount={tableDiffSummary.removed}
          hashes={tableDiff.removed}
          definitions={previousDefinitions}
          otherDefinitions={{}}
        />

        <DiffList
          version={version}
          title="Reclassified"
          diffTypeSlug="reclassified"
          tableName={tableName}
          fullHashCount={tableDiffSummary.reclassified}
          hashes={tableDiff.reclassified}
          definitions={previousDefinitions}
          otherDefinitions={{}}
        />

        <DiffList
          version={version}
          title="Modified"
          diffTypeSlug="modified"
          tableName={tableName}
          fullHashCount={tableDiffSummary.modified}
          hashes={tableDiff.modified ?? []}
          definitions={definitions}
          otherDefinitions={{}}
        />
      </div>

      <div className={s.side}>
        <div className={s.stickySide}>
          <IndexTable
            tableName={tableName}
            version={version}
            pageTableDiffSummary={thisPageTableDiffSummary}
            tableDiffSummary={tableDiffSummary}
            versionDiffSummary={versionDiffSummary}
          />
        </div>
      </div>
    </div>
  );
}
