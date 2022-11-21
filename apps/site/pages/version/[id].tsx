import { GetStaticProps, GetStaticPaths } from "next";

import s from "./styles.module.scss";
import Version from "../../components/Version";
import { format } from "date-fns";
import duration from "../../lib/duration";
import { ManifestVersionSummary, S3Archive } from "@destiny-definitions/common";
import { getParamString, getVersionSummary } from "../../lib/serverUtils";

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
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<VersionIndexStaticProps> = async (
  context
) => {
  const s3Client = S3Archive.newFromEnvVars();
  const versionId = getParamString(context?.params?.id);
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
      label: format(new Date(version.createdAt), "E do MMM, u"),
      to: `/version/${version.id}`,
    },
  ];

  const canonical = `/version/${version.id}`;

  return {
    props: {
      breadcrumbs,
      version: versionSummary,
      meta: {
        canonical: canonical,
      },
    },
    revalidate: duration("1 day"),
  };
};
