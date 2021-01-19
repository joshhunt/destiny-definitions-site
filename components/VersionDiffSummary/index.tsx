import { AllDefinitionDiffs } from "../../types";

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
          <td>Modified</td>
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
                  <a
                    href={`/version/${id}/${tableName}`}
                    className={commonStyles.link}
                  >
                    {friendlyDiffName(tableName)}
                  </a>
                </td>
                <td>
                  <DiffNumber
                    value={diffs.added.length}
                    suffix="+"
                    className={s.numberAdded}
                  />
                </td>
                <td>
                  <DiffNumber
                    value={diffs.unclassified.length}
                    className={s.numberUnclassified}
                  />
                </td>
                <td>
                  <DiffNumber
                    value={diffs.removed.length}
                    suffix="-"
                    className={s.numberRemoved}
                  />
                </td>
                <td>
                  <DiffNumber
                    value={diffs.modified.length}
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
  suffix?: React.ReactNode;
}

const DiffNumber: React.FC<DiffNumberProps> = ({
  value,
  className,
  suffix,
}) => {
  const isZero = value === 0;
  return (
    <span className={isZero ? s.zeroNumber : className}>
      {value}
      {!isZero && suffix}
    </span>
  );
};
