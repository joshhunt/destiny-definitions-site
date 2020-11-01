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
  dataServerResponse: any;
}

export default function Home({
  versions,
  diffsForVersion,
  dataServerResponse,
}: HomeStaticProps) {
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

      <pre>{JSON.stringify(dataServerResponse, null, 2)}</pre>
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
    const diffData = await getDiffForVersion(manifestVersion.id);
    diffsForVersion[manifestVersion.id] = diffData;
  }

  const dataServerResponse = await (
    await fetch("http://localhost:7777")
  ).json();

  return {
    props: { versions: data, diffsForVersion, dataServerResponse },
  };
};
