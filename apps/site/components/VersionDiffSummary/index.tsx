import s from "./styles.module.scss";
import commonStyles from "../../styles/common.module.scss";
import { friendlyDiffName } from "../../lib/utils";
import definitionsMetadata from "../definitionsMetadata";
import { VersionDiffSummary } from "@destiny-definitions/common";
import Link from "next/link";

interface VersionDiffSummaryProps {
  id: string;
  diffSummary: VersionDiffSummary;
}

export default function VersionTable({
  id,
  diffSummary,
}: VersionDiffSummaryProps) {
  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td>Definition table</td>
          <td>Added</td>
          <td>Unclassified</td>
          <td>Removed</td>
          <td>Modified</td>
        </tr>
      </thead>

      <tbody>
        {Object.entries(diffSummary)
          .sort(([tableNameA], [tableNameB]) => {
            const aIndex = definitionsMetadata[tableNameA]?.index ?? 9999;
            const bIndex = definitionsMetadata[tableNameB]?.index ?? 9999;

            return aIndex - bIndex;
          })
          .filter(([tableName, diffs]) => Object.values(diffs).some((vv) => vv))
          .map(([tableName, diffs]) => {
            const meta = definitionsMetadata[tableName];

            return (
              <tr key={tableName} className={meta?.junk ? s.junkRow : ""}>
                <td>
                  <Link
                    href={`/version/${id}/${tableName}`}
                    className={commonStyles.link}
                  >
                    {friendlyDiffName(tableName)}
                  </Link>
                </td>
                <td>
                  <DiffNumber
                    value={diffs.added}
                    prefix="+"
                    className={s.numberAdded}
                  />
                </td>
                <td>
                  <DiffNumber
                    value={diffs.unclassified}
                    className={s.numberUnclassified}
                  />
                </td>
                <td>
                  <DiffNumber
                    value={diffs.removed}
                    prefix="-"
                    className={s.numberRemoved}
                  />
                </td>
                <td>
                  <DiffNumber
                    value={diffs.modified ?? 0}
                    className={s.numberModified}
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

interface DiffNumberProps {
  value: number;
  className?: string;
  prefix?: React.ReactNode;
}

const DiffNumber: React.FC<DiffNumberProps> = ({
  value,
  className,
  prefix,
}) => {
  const isZero = value === 0;
  return (
    <span className={isZero ? s.zeroNumber : className}>
      {!isZero && prefix}
      {value}
    </span>
  );
};
