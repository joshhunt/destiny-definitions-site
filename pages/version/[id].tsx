import { ManifestVersion, AllDefinitionDiffs } from "../../types";
import { GetStaticProps, GetStaticPaths } from "next";

import s from "./styles.module.scss";
import { getVersionsIndex, getDiffForVersion } from "../../remote";
import VersionDiffSummary from "../../components/VersionDiffSummary";
import Version from "../../components/Version";

interface VersionIndexStaticProps {
  version: ManifestVersion;
  allDefinitionDiffs: null | AllDefinitionDiffs;
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
      params: { id: version.version },
    })) ?? [];

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<VersionIndexStaticProps> = async (
  context
) => {
  const data = await getVersionsIndex();
  const version = data?.find((v) => v.version === context?.params?.id);
  if (!version) throw new Error("Unable to find manifest version for page");

  const allDefinitionDiffs = await getDiffForVersion(version.version);

  return {
    props: {
      version,
      allDefinitionDiffs,
    },
  };
};
