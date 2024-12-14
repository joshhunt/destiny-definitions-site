import { GetStaticProps, GetStaticPaths } from "next";
import { readFile } from "fs/promises";

import s from "./styles.module.scss";
import Version from "../../components/Version";
import duration from "../../lib/duration";
import { ManifestVersionSummary, S3Archive } from "@destiny-definitions/common";
import {
  getParamString,
  getVersionSummary,
  makeMetaProps,
} from "../../lib/serverUtils";
import log from "../../lib/log";
import path from "path";
import { getPathData } from "../../lib/getPathData";

interface VersionIndexStaticProps {
  version: ManifestVersionSummary;
}

export default function VersionIndex({ version }: VersionIndexStaticProps) {
  return (
    <div className={s.root}>
      <Version versionSummary={version} headingPrefix="Released " />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pathData = await getPathData();

  return {
    paths: pathData.map((p) => ({
      params: {
        id: p.id,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<VersionIndexStaticProps> = async (
  context
) => {
  const versionId = getParamString(context?.params?.id);
  log.info(
    {
      route: "version/[id]",
      versionId,
    },
    "getStaticProps called"
  );

  const s3Client = S3Archive.newFromEnvVars();
  const version = await s3Client.getVersion(versionId ?? "");

  if (!version) {
    console.warn(
      `Unable to find manifest version for page ID ${context?.params?.id}`
    );
    return { notFound: true, revalidate: duration("5 minutes") };
  }

  const versionDiff = await s3Client.getVersionDiff(version.id);
  const versionSummary = getVersionSummary(version, versionDiff);

  const breadcrumbs = [
    {
      date: version.createdAt,
      to: `/version/${version.id}`,
    },
  ];

  const canonical = `/version/${version.id}`;

  return {
    props: {
      breadcrumbs,
      version: versionSummary,

      meta: makeMetaProps({
        canonical: canonical,
      }),
    },
    revalidate: duration("1 day"),
  };
};
