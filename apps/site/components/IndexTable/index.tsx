import s from "./styles.module.scss";
import cx from "classnames";
import { castDefinitionsTable, friendlyTableName } from "../../lib/utils";
import {
  DefinitionTable,
  DefinitionTableDiff,
  DefinitionTableDiffSummary,
  ManifestVersion,
  VersionDiffSummary,
} from "@destiny-definitions/common";
import definitionsMetadata from "../definitionsMetadata";
import Link from "next/link";
import { useMemo } from "react";
import { groupHashes } from "../DiffList/typed/InventoryItemDiffList/categorise";

interface IndexTableProps {
  version: ManifestVersion;
  tableName: string;
  versionDiffSummary: VersionDiffSummary;
  tableDiffSummary: DefinitionTableDiffSummary;

  definitions: DefinitionTable;
  tableDiff: DefinitionTableDiff;

  /** The count of hashes being shown on the current page. This can be used to know if the tableDiffSummary has been truncated  */
  pageTableDiffSummary: DefinitionTableDiffSummary;
}

export default function IndexTable({
  version,
  tableName,
  definitions: genericDefinitions,
  tableDiff,
  tableDiffSummary,
  versionDiffSummary,
  pageTableDiffSummary,
}: IndexTableProps) {
  const tables = Object.entries(versionDiffSummary)
    .map(([tableName, counts]) => ({ tableName, ...counts }))
    .sort((tableA, tableB) => {
      const aIndex = definitionsMetadata[tableA.tableName]?.index ?? 9999;
      const bIndex = definitionsMetadata[tableB.tableName]?.index ?? 9999;

      return aIndex - bIndex;
    });

  const showingAllAdded = tableDiffSummary.added <= pageTableDiffSummary.added;
  const showingAllUnclassified =
    tableDiffSummary.unclassified <= pageTableDiffSummary.unclassified;
  const showingAllReclassified =
    tableDiffSummary.reclassified <= pageTableDiffSummary.reclassified;
  const showingAllRemoved =
    tableDiffSummary.removed <= pageTableDiffSummary.removed;
  const showingAllModified =
    tableDiffSummary.modified <= pageTableDiffSummary.modified;

  const hasAdded = tables.some((v) => v.added);
  const hasRemoved = tables.some((v) => v.removed);
  const hasUnclassified = tables.some((v) => v.unclassified);
  const hasReclassfied = tables.some((v) => v.reclassified);
  const hasModified = tables.some((v) => v.modified);

  const subItems = useMemo(() => {
    if (tableName !== "DestinyInventoryItemDefinition") return {};
    const itemDefs = castDefinitionsTable(
      "DestinyInventoryItemDefinition",
      tableName,
      genericDefinitions
    );

    const addedSubNav = showingAllAdded
      ? groupHashes(tableDiff.added, itemDefs).map(
          mapToSubItem.bind(null, "added")
        )
      : undefined;

    const unclassifiedSubNav = showingAllUnclassified
      ? groupHashes(tableDiff.unclassified, itemDefs).map(
          mapToSubItem.bind(null, "unclassified")
        )
      : undefined;

    return {
      added: addedSubNav,
      unclassified: unclassifiedSubNav,
    };
  }, []);

  return (
    <div className={s.root}>
      <TopLevelItem
        href={
          showingAllAdded
            ? `#added`
            : `/version/${version.id}/${tableName}/added`
        }
        label="Added"
        count={tableDiffSummary.added}
        childItems={subItems.added}
        numberClassName="color-added"
      />
      <TopLevelItem
        href={
          showingAllUnclassified
            ? `#unclassified`
            : `/version/${version.id}/${tableName}/unclassified`
        }
        label="Unclassified"
        count={tableDiffSummary.unclassified}
        childItems={subItems.unclassified}
        numberClassName="color-unclassified"
      />
      <TopLevelItem
        href={
          showingAllReclassified
            ? `#reclassified`
            : `/version/${version.id}/${tableName}/reclassified`
        }
        label="Reclassified"
        count={tableDiffSummary.reclassified}
        numberClassName="color-reclassified"
      />
      <TopLevelItem
        href={
          showingAllRemoved
            ? `#removed`
            : `/version/${version.id}/${tableName}/removed`
        }
        label="Removed"
        count={tableDiffSummary.removed}
        numberClassName="color-removed"
      />
      <TopLevelItem
        href={
          showingAllModified
            ? `#modified`
            : `/version/${version.id}/${tableName}/modified`
        }
        label="Modified"
        count={tableDiffSummary.modified}
        numberClassName="color-modified"
      />

      <div className={s.otherTables}>
        <div className={s.topItem}>Other tables</div>

        <div className={s.otherTableWrapper}>
          <table className={s.otherTablesTable} cellPadding={0} cellSpacing={0}>
            <tbody>
              {tables.map((table) => {
                const meta = definitionsMetadata[table.tableName];

                return (
                  <tr key={table.tableName}>
                    <td>
                      <a
                        href={`/version/${version.id}/${table.tableName}`}
                        className={cx(s.otherTableName, meta?.junk && s.junk)}
                      >
                        {friendlyTableName(table.tableName)}
                      </a>
                    </td>

                    {hasAdded && (
                      <OtherTableCountCell
                        title="Added"
                        count={table.added}
                        prefix="+"
                        className={s.countCellAdded}
                      />
                    )}

                    {hasUnclassified && (
                      <OtherTableCountCell
                        title="Unclassified"
                        count={table.unclassified}
                        className={s.countCellUnclassified}
                      />
                    )}

                    {hasRemoved && (
                      <OtherTableCountCell
                        title="Removed"
                        count={table.removed}
                        prefix="-"
                        className={s.countCellRemoved}
                      />
                    )}

                    {hasReclassfied && (
                      <OtherTableCountCell
                        title="Reclassified"
                        count={table.reclassified}
                        className={s.countCellReclassified}
                      />
                    )}

                    {hasModified && (
                      <OtherTableCountCell
                        title="Modified"
                        count={table.modified}
                        className={s.countCellModified}
                      />
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function mapToSubItem(
  diffType: string,
  [groupName, groupHashes]: [string, number[]]
) {
  return {
    label: groupName,
    count: groupHashes.length,
    url: `#${diffType}_${groupName}`,
  };
}

function TopLevelItem({
  href,
  label,
  count,
  childItems,
  numberClassName,
}: {
  href: string;
  label: string;
  count: number;
  childItems?: undefined | { label: string; count: number; url: string }[];
  numberClassName: string;
}) {
  if (count === 0) return null;

  return (
    <>
      <Link className={s.topItem} href={href} prefetch={false}>
        <div className={s.name}>{label}</div>
        <div className={cx(s.count, numberClassName)}>{count}</div>
      </Link>

      {childItems?.map((child) => (
        <a key={child.label} className={s.subItem} href={child.url}>
          <div className={s.name}>{child.label}</div>
          <div className={cx(s.count, numberClassName)}>{child.count}</div>
        </a>
      ))}
    </>
  );
}

function OtherTableCountCell({
  title,
  prefix,
  count,
  className,
}: {
  title: string;
  prefix?: string;
  count: number;
  className: string;
}) {
  if (!count) {
    return <td />;
  }
  return (
    <td title={title} className={className}>
      {prefix}
      {count}
    </td>
  );
}
