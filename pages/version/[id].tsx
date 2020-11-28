import { ManifestVersion, AllDefinitionDiffs } from "../../types";
import { GetStaticProps, GetStaticPaths } from "next";

import s from "./styles.module.scss";
import { getVersionsIndex, getDiffForVersion } from "../../remote";
import VersionDiffSummary from "../../components/VersionDiffSummary";
import Version from "../../components/Version";

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

const revalidate = 5;

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
  const data = await getVersionsIndex();
  const version = data?.find((v) => v.id === context?.params?.id);
  if (!version) {
    console.warn(
      `Unable to find manifest version for page ID ${context?.params?.id}`
    );
    return { notFound: true, revalidate };
  }

  const allDefinitionDiffs = await getDiffForVersion(version.id);

  return {
    props: {
      version,
      allDefinitionDiffs,
    },
    revalidate,
  };
};
