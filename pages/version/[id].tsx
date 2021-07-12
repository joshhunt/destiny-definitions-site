import { ManifestVersion, AllDefinitionDiffs } from "../../types";
import { GetStaticProps, GetStaticPaths } from "next";

import s from "./styles.module.scss";
import { getVersionsIndex, getDiffForVersion, getVersion } from "../../remote";
import Version from "../../components/Version";
import { format } from "date-fns";

interface VersionIndexStaticProps {
  version: ManifestVersion;
  allDefinitionDiffs: undefined | AllDefinitionDiffs;
}

export default function VersionIndex({
  version,
  allDefinitionDiffs,
}: VersionIndexStaticProps) {
  if (!allDefinitionDiffs) {
    return null;
  }

  return (
    <div className={s.root}>
      <Version
        manifestVersion={version}
        diff={allDefinitionDiffs}
        headingPrefix="Released "
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getVersionsIndex();

  const paths =
    data?.map((version) => ({
      params: { id: version.id },
    })) ?? [];

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<VersionIndexStaticProps> = async (
  context
) => {
  const versionIdParam = Array.isArray(context?.params?.id)
    ? context?.params?.id[0]
    : context?.params?.id;

  const version = await getVersion(versionIdParam ?? "");

  if (!version) {
    console.warn(
      `Unable to find manifest version for page ID ${context?.params?.id}`
    );
    return { notFound: true, revalidate: 30 };
  }

  const allDefinitionDiffs = await getDiffForVersion(version.id);

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
      version,
      allDefinitionDiffs,
      meta: {
        canonical: canonical,
      },
    },
    revalidate: 60 * 60,
  };
};
