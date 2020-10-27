import s from "./styles.module.scss";
import { Fragment } from "react";
import Link from "next/link";
import { VersionDiffCounts } from "../../types";
import { friendlyDiffName } from "../../lib/utils";

interface IndexTableProps {
  versionDiffCounts: VersionDiffCounts;
  versionId: string;
  data: {
    name: string;
    count: number;
    subItems:
      | null
      | {
          name: string;
          count: number;
        }[];
  }[];
}

export default function IndexTable({
  data,
  versionId,
  versionDiffCounts,
}: IndexTableProps) {
  return (
    <div className={s.root}>
      {data.map((topLevel) => {
        return (
          <Fragment key={topLevel.name}>
            <a className={s.topItem} href={`#${topLevel.name}`}>
              <div className={s.name}>{topLevel.name}</div>
              <div className={s.count}>{topLevel.count}</div>
            </a>

            {topLevel.subItems?.map((subItem) => {
              return (
                <a
                  key={subItem.name}
                  className={s.subItem}
                  href={`#${topLevel.name}_${subItem.name}`}
                >
                  <div className={s.name}>{subItem.name}</div>
                  <div className={s.count}>{subItem.count}</div>
                </a>
              );
            })}
          </Fragment>
        );
      })}

      <div className={s.otherTables}>
        <table className={s.otherTablesTable}>
          <tbody>
            {versionDiffCounts.map((diff) => (
              <tr key={diff.tableName}>
                <td>
                  <Link href={`/version/${versionId}/${diff.tableName}`}>
                    <a className={s.otherTableName}>
                      {friendlyDiffName(diff.tableName)}
                    </a>
                  </Link>
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
      </div>
    </div>
  );
}
