import React from "react";
import VersionDiffSummary from "../VersionDiffSummary";
import { format, parse } from "date-fns";

import commonStyles from "../../styles/common.module.scss";
import { ManifestVersion, AllDefinitionDiffs } from "../../types";
import Link from "next/link";

import s from "./styles.module.scss";

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
  return (
    <div className={s.version}>
      <h2 className={s.versionTitle}>
        <Link href={`/version/[id]`} as={`/version/${manifestVersion.version}`}>
          <a className={commonStyles.invisibleLink}>
            {headingPrefix}
            {format(new Date(manifestVersion.createdAt), "E do MMM, u")}
          </a>
        </Link>
      </h2>
      <p>
        Bungie version <code>{manifestVersion.version}</code>, built{" "}
        {format(dateFromVersion(manifestVersion.version), "E do MMM, p")}
      </p>

      <VersionDiffSummary
        version={manifestVersion.version}
        allDefinitionDiffs={diff}
      />
    </div>
  );
}
