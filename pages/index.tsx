import Link from "next/link";
import { GetStaticProps } from "next";
import { format } from "date-fns";

import { ManifestVersion, DiffsByVersion } from "../types";
import { getVersionsIndex, getDiffForVersion } from "../remote";
import VersionDiffSummary from "../components/VersionDiffSummary";

import commonStyles from "../styles/common.module.scss";
import s from "./indexStyles.module.scss";

interface HomeStaticProps {
  versions: ManifestVersion[];
  diffsForVersion: DiffsByVersion;
}

export default function Home({ versions, diffsForVersion }: HomeStaticProps) {
  return (
    <div className={s.root}>
      <h2>Versions</h2>
      <div className={s.versionList}>
        {versions.map((manifestVersion) => {
          const diff = diffsForVersion[manifestVersion.version];

          if (!diff) {
            return null;
          }

          return (
            <div className={s.version} key={manifestVersion.version}>
              <h3 className={s.versionTitle}>
                <Link
                  href={`/version/[id]`}
                  as={`/version/${manifestVersion.version}`}
                >
                  <a className={commonStyles.invisibleLink}>
                    {format(new Date(manifestVersion.createdAt), "E do MMM, u")}
                  </a>
                </Link>
              </h3>
              <p>
                Bungie version <code>{manifestVersion.version}</code>.
              </p>

              <VersionDiffSummary
                version={manifestVersion.version}
                allDefinitionDiffs={diff}
              />
            </div>
          );
        })}
      </div>
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
