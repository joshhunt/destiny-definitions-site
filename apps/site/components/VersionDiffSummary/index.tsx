import s from "./styles.module.scss";
import cx from "classnames";
import commonStyles from "../../styles/common.module.scss";
import { friendlyTableName } from "../../lib/utils";
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
  const tables = Object.entries(diffSummary)
    .filter(([tableName, tableSummary]) =>
      Object.values(tableSummary).some((v) => v)
    )
    .map(([tableName, tableSummary]) => ({ tableName, ...tableSummary }))
    .sort((tableA, tableB) => {
      const aIndex = definitionsMetadata[tableA.tableName]?.index ?? 9999;
      const bIndex = definitionsMetadata[tableB.tableName]?.index ?? 9999;

      return aIndex - bIndex;
    });

  const hasAdded = tables.some((v) => v.added);
  const hasRemoved = tables.some((v) => v.removed);
  const hasUnclassified = tables.some((v) => v.unclassified);
  const hasReclassfied = tables.some((v) => v.reclassified);
  const hasModified = tables.some((v) => v.modified);

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td>Definition table</td>
          {hasAdded && <td>Added</td>}
          {hasUnclassified && <td>Unclassified</td>}
          {hasReclassfied && <td>Reclassified</td>}
          {hasRemoved && <td>Removed</td>}
          {hasModified && <td>Modified</td>}
        </tr>
      </thead>

      <tbody>
        {tables.map((table) => {
          const meta = definitionsMetadata[table.tableName];

          return (
            <tr
              key={table.tableName}
              data-testid={meta?.junk ? "junk-table-row" : "table-row"}
              className={meta?.junk ? s.junkRow : ""}
            >
              <td>
                <Link
                  data-testid="version-table-link"
                  href={`/version/${id}/${table.tableName}`}
                  className={commonStyles.link}
                >
                  {friendlyTableName(table.tableName)}
                </Link>
              </td>
              {hasAdded && (
                <DiffNumberCell
                  value={table.added}
                  prefix="+"
                  className="color-added"
                />
              )}
              {hasUnclassified && (
                <DiffNumberCell
                  value={table.unclassified}
                  className="color-unclassified"
                />
              )}
              {hasReclassfied && (
                <DiffNumberCell
                  value={table.reclassified}
                  className="color-reclassified"
                />
              )}
              {hasRemoved && (
                <DiffNumberCell
                  value={table.removed}
                  prefix="-"
                  className="color-removed"
                />
              )}
              {hasModified && (
                <DiffNumberCell
                  value={table.modified ?? 0}
                  className="color-modified"
                />
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

interface DiffNumberCellProps {
  value: number;
  className?: string;
  prefix?: React.ReactNode;
}

const DiffNumberCell: React.FC<DiffNumberCellProps> = ({
  value,
  className,
  prefix,
}) => {
  const isZero = value === 0;
  return (
    <td className={cx(s.numberCell, isZero ? s.zeroNumber : className)}>
      {!isZero && prefix}
      {value}
    </td>
  );
};
