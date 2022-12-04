import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";

import { ManifestVersionSummary, S3Archive } from "@destiny-definitions/common";

import s from "./indexStyles.module.scss";
import Version from "../components/Version";
import duration from "../lib/duration";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/pro-solid-svg-icons";
import { getVersionSummary, makeMetaProps } from "../lib/serverUtils";
import Link from "next/link";
import log from "../lib/log";

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
          <Link href={`/${currentPage - 1}`}>
            <FontAwesomeIcon icon={faChevronLeft} /> Prev
          </Link>
        )}{" "}
        <span>
          Page {currentPage} of {lastPage}
        </span>{" "}
        {hasNextPage && (
          <Link data-testid="pagination-next" href={`/${currentPage + 1}`}>
            Next
            <FontAwesomeIcon icon={faChevronRight} />
          </Link>
        )}{" "}
        <Link href={`/${lastPage}`}>
          Last
          <FontAwesomeIcon icon={faChevronRight} />
          <FontAwesomeIcon icon={faChevronRight} />
        </Link>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
const PAGE_SIZE = 10;

export const getStaticProps: GetStaticProps<HomeStaticProps> = async (
  context
) => {
  const indexParam =
    (Array.isArray(context.params?.index)
      ? context.params?.index
      : [context.params?.index]) ?? [];

  const pageParam = indexParam.at(0) ?? "1";
  const pageNumber = parseInt(pageParam);

  log.info({ route: "[[...index]]", pageNumber }, "getStaticProps called");

  if (indexParam.length > 1 || isNaN(pageNumber)) {
    return { notFound: true, revalidate: duration("1 week") };
  }

  const s3Client = S3Archive.newFromEnvVars();

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
    const summary = getVersionSummary(manifestVersion, diffData);
    versionSummaries.push(summary);
  }

  return {
    props: {
      versions: versionSummaries,
      pagination,
      meta: makeMetaProps(),
    },
    revalidate: duration("10 minutes"),
  };
};
