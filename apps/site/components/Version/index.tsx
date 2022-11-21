import React from "react";
import { format, parse } from "date-fns";
import cx from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import VersionTable from "../VersionDiffSummary";
import commonStyles from "../../styles/common.module.scss";
import Link from "next/link";
import _additionalData from "./additionalData.json";

import s from "./styles.module.scss";
import { ManifestVersionSummary } from "@destiny-definitions/common";

interface AdditionalData {
  subtitle: string;
}

interface VersionProps {
  versionSummary: ManifestVersionSummary;
  headingPrefix?: string;
}

const additionalData = _additionalData as Record<string, AdditionalData>;

export default function Version({
  versionSummary,
  headingPrefix,
}: VersionProps) {
  const { subtitle } = additionalData[versionSummary.id] || {};

  const hasChanges = Object.values(versionSummary.diffCounts).some((item) => {
    const thisCount = Object.values(item).reduce(
      (acc2, item2) => item2 + acc2,
      0
    );

    return thisCount > 0;
  });

  return (
    <div className={s.version}>
      {subtitle && <h3 className={cx("h5", s.subtitle)}>{subtitle}</h3>}

      <h2 className={s.versionTitle}>
        <Link
          className={commonStyles.invisibleLink}
          href={`/version/${versionSummary.id}`}
        >
          {headingPrefix}
          {format(new Date(versionSummary.createdAt), "PPPP")}{" "}
          <sup>
            <FontAwesomeIcon icon={faLink} />
          </sup>
        </Link>
      </h2>

      <table className={s.table}>
        <tbody>
          <tr>
            <td>Time</td>
            <td>{format(new Date(versionSummary.createdAt), "pppp")}</td>
          </tr>
          <tr>
            <td>ID</td>
            <td>
              <code>{versionSummary.id}</code>
            </td>
          </tr>
          <tr>
            <td>Bungie version</td>
            <td>
              <code>{versionSummary.version}</code>
            </td>
          </tr>
        </tbody>
      </table>

      {hasChanges ? (
        <VersionTable
          id={versionSummary.id}
          diffSummary={versionSummary.diffCounts}
        />
      ) : (
        <p>
          <em>Nothing changed in this version</em>
        </p>
      )}
    </div>
  );
}
