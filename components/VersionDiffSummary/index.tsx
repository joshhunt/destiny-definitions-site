import { AllDefinitionDiffs } from "../../types";

import Link from "next/link";

import s from "./styles.module.scss";
import commonStyles from "../../styles/common.module.scss";
import { friendlyDiffName } from "../../lib/utils";
import definitionsMetadata from "../definitionsMetadata";

interface VersionDiffSummaryProps {
  id: string;
  allDefinitionDiffs: AllDefinitionDiffs;
}

export default function VersionDiffSummary({
  id,
  allDefinitionDiffs,
}: VersionDiffSummaryProps) {
  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td>Definition table</td>
          <td>Added</td>
          <td>Unclassified</td>
          <td>Removed</td>
        </tr>
      </thead>

      <tbody>
        {Object.entries(allDefinitionDiffs)
          .sort(([tableNameA], [tableNameB]) => {
            const aIndex = definitionsMetadata[tableNameA].index;
            const bIndex = definitionsMetadata[tableNameB].index;

            return aIndex - bIndex;
          })
          .filter(([tableName, diffs]) =>
            Object.values(diffs).some((vv) => vv.length)
          )
          .map(([tableName, diffs]) => {
            const meta = definitionsMetadata[tableName];

            return (
              <tr key={tableName} className={meta.junk ? s.junkRow : ""}>
                <td>
                  <Link
                    href="/version/[id]/[table]"
                    as={`/version/${id}/${tableName}`}
                  >
                    <a className={commonStyles.link}>
                      {friendlyDiffName(tableName)}
                    </a>
                  </Link>
                </td>
                <td>{diffs.added.length}</td>
                <td>{diffs.unclassified.length}</td>
                <td>{diffs.removed.length}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
