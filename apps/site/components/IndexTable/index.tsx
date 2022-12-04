import s from "./styles.module.scss";
import cx from "classnames";
import { Fragment } from "react";
import { friendlyDiffName } from "../../lib/utils";
import {
  DefinitionTableDiffSummary,
  VersionDiffSummary,
} from "@destiny-definitions/common";

interface IndexTableProps {
  versionDiffSummary: VersionDiffSummary;
  tableDiffSummary: DefinitionTableDiffSummary;
}

export default function IndexTable({
  tableDiffSummary,
  versionDiffSummary,
}: IndexTableProps) {
  return (
    <div className={s.root}>
      <TopLevelItem
        href={`#added`}
        label="Added"
        count={tableDiffSummary.added}
        numberClassName="color-added"
      />
      <TopLevelItem
        href={`#unclassified`}
        label="Unclassified"
        count={tableDiffSummary.unclassified}
        numberClassName="color-unclassified"
      />
      <TopLevelItem
        href={`#reclassified`}
        label="Reclassified"
        count={tableDiffSummary.reclassified}
        numberClassName="color-reclassified"
      />
      <TopLevelItem
        href={`#removed`}
        label="Removed"
        count={tableDiffSummary.removed}
        numberClassName="color-removed"
      />
      <TopLevelItem
        href={`#modified`}
        label="Modified"
        count={tableDiffSummary.modified}
        numberClassName="color-modified"
      />

      {/* <div className={s.otherTables}>
        <div className={s.topItem}>Other tables</div>

        <table className={s.otherTablesTable} cellPadding={0} cellSpacing={0}>
          <tbody>
            {versionDiffCounts.map((diff) => (
              <tr key={diff.tableName}>
                <td>
                  <a
                    href={`/version/${versionId}/${diff.tableName}`}
                    className={s.otherTableName}
                  >
                    {friendlyDiffName(diff.tableName)}
                  </a>
                </td>
                {diff.added > 0 ? (
                  <td className={s.countCellAdded}>+{diff.added}</td>
                ) : (
                  <td />
                )}
                {diff.unclassified > 0 ? (
                  <td className={s.countCellUnclassified}>
                    +{diff.unclassified}
                  </td>
                ) : (
                  <td />
                )}
                {diff.removed > 0 ? (
                  <td className={s.countCellRemoved}>-{diff.removed}</td>
                ) : (
                  <td />
                )}
                {diff.reclassified > 0 ? (
                  <td className={s.countCellReclassified}>
                    -{diff.reclassified}
                  </td>
                ) : (
                  <td />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

function TopLevelItem({
  href,
  label,
  count,
  numberClassName,
}: {
  href: string;
  label: string;
  count: number;
  numberClassName: string;
}) {
  if (count === 0) return null;

  return (
    <a className={s.topItem} href={href}>
      <div className={s.name}>{label}</div>
      <div className={cx(s.count, numberClassName)}>{count}</div>
    </a>
  );
}
