import { GetStaticPaths, GetStaticProps } from "next";

import { ManifestVersionSummary, S3Archive } from "@destiny-definitions/common";

import duration from "../lib/duration";
import { getVersionSummary, makeMetaProps } from "../lib/serverUtils";
import log from "../lib/log";
import { IndexPageProps } from "../components/IndexPage";
import IndexPage from "../components/IndexPage";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
const PAGE_SIZE = 10;

export default IndexPage;

export const getStaticProps: GetStaticProps<IndexPageProps> = async (
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

  const versionSummariesPromise = pageVersions.map(async (manifestVersion) => {
    const diffData = await s3Client.getVersionDiff(manifestVersion.id);
    const summary = getVersionSummary(manifestVersion, diffData);
    return summary;
  });

  const versionSummaries: ManifestVersionSummary[] = await Promise.all(
    versionSummariesPromise
  );

  return {
    props: {
      versions: versionSummaries,
      pagination,
      meta: makeMetaProps(),
    },
    revalidate: duration("10 minutes"),
  };
};
