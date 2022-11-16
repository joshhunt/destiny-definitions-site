import { GetStaticProps } from "next";

import {
  ManifestVersion,
  S3Archive,
  VersionDiff,
} from "@destiny-definitions/common";

import s from "./indexStyles.module.scss";
import Version from "../components/Version";
import duration from "../lib/duration";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HomeStaticProps {
  versions: ManifestVersion[];
  diffsForVersion: Record<string, VersionDiff>;
  pagination: {
    hasPrevPage: boolean;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

export default function Home({
  versions,
  diffsForVersion,
  pagination,
}: HomeStaticProps) {
  const { hasPrevPage, currentPage, hasNextPage, lastPage } = pagination;
  return (
    <div className={s.root}>
      <div className={s.versionList}>
        {versions.map((manifestVersion) => {
          const diff = diffsForVersion[manifestVersion.id];

          if (!diff) {
            return null;
          }

          return (
            <Version
              key={manifestVersion.id}
              manifestVersion={manifestVersion}
              diff={diff}
            />
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

  const diffsForVersion: Record<string, VersionDiff> = {};

  for (const manifestVersion of pageVersions) {
    const diffData = await s3Client.getVersionDiff(manifestVersion.id);
    diffsForVersion[manifestVersion.id] = diffData;
  }

  return {
    props: { versions: indexData, diffsForVersion, pagination },
    revalidate: duration("5 minutes"),
  };
};
