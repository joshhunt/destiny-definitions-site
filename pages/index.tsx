import Link from "next/link";
import { GetStaticProps } from "next";

import s from "./indexStyles.module.scss";
import { ManifestVersion, DiffsByVersion } from "../types";
import { getVersionsIndex, getDiffForVersion } from "../remote";
import VersionDiffSummary from "../components/VersionDiffSummary";

import commonStyles from "../common.module.scss";

interface HomeStaticProps {
  versions: ManifestVersion[];
  diffsForVersion: DiffsByVersion;
}

export default function Home({ versions, diffsForVersion }: HomeStaticProps) {
  return (
    <div className={s.root}>
      <h1>Destiny definition versions</h1>

      {versions.map((manifestVersion) => {
        const diff = diffsForVersion[manifestVersion.version];

        return (
          <div key={manifestVersion.version}>
            <h2>Version {manifestVersion.version}</h2>
            <p>created at: {manifestVersion.createdAt}</p>
            <p>
              <Link
                href={`/version/[id]`}
                as={`/version/${manifestVersion.version}`}
              >
                <a className={commonStyles.link}>Page</a>
              </Link>
            </p>

            {diff ? (
              <VersionDiffSummary
                version={manifestVersion.version}
                allDefinitionDiffs={diff}
              />
            ) : (
              <p>no diff</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeStaticProps> = async (
  context
) => {
  const data = await getVersionsIndex();
  if (!data) throw new Error("Versions index is undefined");
  data.reverse();

  const diffsForVersion: DiffsByVersion = {};

  for (const manifestVersion of data) {
    const diffData = await getDiffForVersion(manifestVersion.version);
    diffsForVersion[manifestVersion.version] = diffData;
  }

  return {
    props: { versions: data, diffsForVersion },
  };
};
