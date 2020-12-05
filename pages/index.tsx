import Link from "next/link";
import { GetStaticProps } from "next";
import { format } from "date-fns";

import { ManifestVersion, DiffsByVersion } from "../types";
import { getVersionsIndex, getDiffForVersion } from "../remote";
import VersionDiffSummary from "../components/VersionDiffSummary";

import commonStyles from "../styles/common.module.scss";
import s from "./indexStyles.module.scss";
import Version from "../components/Version";

interface HomeStaticProps {
  versions: ManifestVersion[];
  diffsForVersion: DiffsByVersion;
}

export default function Home({ versions, diffsForVersion }: HomeStaticProps) {
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
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeStaticProps> = async () => {
  const data = [...((await getVersionsIndex()) ?? [])];
  if (!data) throw new Error("Versions index is undefined");
  data.reverse();

  const diffsForVersion: DiffsByVersion = {};

  for (const manifestVersion of data) {
    const diffData = await getDiffForVersion(manifestVersion.id);
    diffsForVersion[manifestVersion.id] = diffData;
  }

  return {
    props: { versions: data, diffsForVersion },
    revalidate: 5 * 60,
  };
};
