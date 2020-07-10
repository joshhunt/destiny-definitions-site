import { ManifestVersion, AllDefinitionDiffs } from "../../types";
import { GetStaticProps, GetStaticPaths } from "next";

import s from "./styles.module.scss";
import { getVersionsIndex, getDiffForVersion } from "../../remote";
import VersionDiffSummary from "../../components/VersionDiffSummary";

interface VersionIndexStaticProps {
  version: ManifestVersion;
  allDefinitionDiffs: null | AllDefinitionDiffs;
}

export default function VersionIndex({
  version,
  allDefinitionDiffs,
}: VersionIndexStaticProps) {
  return (
    <div className={s.root}>
      <h1>Version {version?.version}</h1>

      {allDefinitionDiffs ? (
        <VersionDiffSummary
          version={version.version}
          allDefinitionDiffs={allDefinitionDiffs}
        />
      ) : (
        <p>No diffs for this version</p>
      )}
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
