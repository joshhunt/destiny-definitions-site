import React from "react";
import VersionDiffSummary from "../VersionDiffSummary";
import { format, parse } from "date-fns";

import commonStyles from "../../styles/common.module.scss";
import { ManifestVersion, AllDefinitionDiffs } from "../../types";
import Link from "next/link";

import s from "./styles.module.scss";
import Icon from "../Icon";

interface VersionProps {
  manifestVersion: ManifestVersion;
  diff: AllDefinitionDiffs;
  headingPrefix?: string;
}

const RE = /(\d+)/g;
function dateFromVersion(version: string) {
  const matches = version.match(RE);

  if (!matches) {
    return new Date(777, 7, 7, 7, 7, 7);
  }

  const [, year, month, day, time] = matches;
  const dateString = `${year}-${month}-${day}-${time}`;
  const result = parse(dateString, "yy-MM-dd-HHmm", new Date());
  return result;
}

export default function Version({
  manifestVersion,
  diff,
  headingPrefix,
}: VersionProps) {
  const hasChanges = Object.values(diff).some((item) => {
    const thisCount = Object.values(item).reduce(
      (acc2, item2) => item2.length + acc2,
      0
    );

    return thisCount > 0;
  });

  return (
    <div className={s.version}>
      <h2 className={s.versionTitle}>
        <Link href={`/version/[id]`} as={`/version/${manifestVersion.id}`}>
          <a className={commonStyles.invisibleLink}>
            {headingPrefix}
            {format(new Date(manifestVersion.createdAt), "E do MMM, u")}{" "}
            <sup>
              <Icon name="link" />
            </sup>
          </a>
        </Link>
      </h2>

      <table className={s.table}>
        <tbody>
          <tr>
            <td>ID</td>
            <td>
              <code>{manifestVersion.id}</code>
            </td>
          </tr>
          <tr>
            <td>Bungie version</td>
            <td>
              <code>{manifestVersion.version}</code>
            </td>
          </tr>
        </tbody>
      </table>

      {hasChanges ? (
        <VersionDiffSummary id={manifestVersion.id} allDefinitionDiffs={diff} />
      ) : (
        <p>
          <em>Nothing changed in this version</em>
        </p>
      )}
    </div>
  );
}
