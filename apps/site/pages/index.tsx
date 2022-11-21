import { GetStaticProps } from "next";

import {
  ManifestVersionSummary,
  S3Archive,
  VersionDiff,
  VersionDiffSummary,
} from "@destiny-definitions/common";

import s from "./indexStyles.module.scss";
import Version from "../components/Version";
import duration from "../lib/duration";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mapValues } from "lodash";

interface HomeStaticProps {
  versions: ManifestVersionSummary[];
  pagination: {
    hasPrevPage: boolean;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

export default function Home({ versions, pagination }: HomeStaticProps) {
  const { hasPrevPage, currentPage, hasNextPage, lastPage } = pagination;
  return (
    <div className={s.root}>
      <div className={s.versionList}>
        {versions.map((versionSummary) => {
          return (
            <Version key={versionSummary.id} versionSummary={versionSummary} />
          );
        })}
      </div>

      <br />
      <br />

      <div className={s.pagination}>
        {hasPrevPage && (
          <a href={`/page/${currentPage - 1}`}>
            <FontAwesomeIcon icon={faChevronLeft} /> Prev
          </a>
        )}{" "}
        <span>
          Page {currentPage} of {lastPage}
        </span>{" "}
        {hasNextPage && (
          <a href={`/page/${currentPage + 1}`}>
            Next
            <FontAwesomeIcon icon={faChevronRight} />
          </a>
        )}{" "}
        <a href={`/page/${lastPage}`}>
          Last
          <FontAwesomeIcon icon={faChevronRight} />
          <FontAwesomeIcon icon={faChevronRight} />
        </a>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export const getStaticProps: GetStaticProps<HomeStaticProps> = async (
  context
) => {
  const pageParam = context.params?.pageNumber ?? "1";
  const pageNumber = parseInt(
    typeof pageParam === "string" ? pageParam : pageParam[0]
  );

  const s3Client = new S3Archive({
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    bucket: process.env.S3_BUCKET ?? "",
    region: process.env.S3_REGION ?? "",
  });

  const indexData = await s3Client.getVersionHistory();
  indexData.reverse();

  const totalPages = Math.ceil(indexData.length / PAGE_SIZE);

  const indexStart = (pageNumber - 1) * PAGE_SIZE;
  const indexEnd = indexStart + PAGE_SIZE;

  const pagination = {
    hasNextPage: pageNumber < totalPages,
    currentPage: pageNumber,
    lastPage: totalPages,
    hasPrevPage: pageNumber > 1,
  };

  const pageVersions = indexData.slice(indexStart, indexEnd);

  const versionSummaries: ManifestVersionSummary[] = [];

  for (const manifestVersion of pageVersions) {
    const diffData = await s3Client.getVersionDiff(manifestVersion.id);
    versionSummaries.push({
      ...manifestVersion,
      diffCounts: getDiffSummary(diffData),
    });
  }

  return {
    props: { versions: versionSummaries, pagination },
    revalidate: duration("5 minutes"),
  };
};

function getDiffSummary(versionDiff: VersionDiff): VersionDiffSummary {
  return mapValues(versionDiff, (tableDiff) => {
    const _tableDiff = { ...tableDiff, modified: tableDiff.modified ?? [] };

    return mapValues(_tableDiff, (hashes) => hashes.length);
  });
}
