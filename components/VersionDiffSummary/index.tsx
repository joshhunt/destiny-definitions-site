import { AllDefinitionDiffs } from "../../types";

import Link from "next/link";

import s from "./styles.module.scss";
import commonStyles from "../../common.module.scss";

interface VersionDiffSummaryProps {
  version: string;
  allDefinitionDiffs: AllDefinitionDiffs;
}

function friendlyDiffName(name: string) {
  const match = name.match(/Destiny(\w+)Definition/);

  return match ? match[1] : name;
}

export default function VersionDiffSummary({
  version,
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
          .filter(([tableName, diffs]) =>
            Object.values(diffs).some((vv) => vv.length)
          )
          .map(([tableName, diffs]) => (
            <tr key={tableName}>
              <td>
                <Link
                  href="/version/[id]/[table]"
                  as={`/version/${version}/${tableName}`}
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
          ))}
      </tbody>
    </table>
  );
}
