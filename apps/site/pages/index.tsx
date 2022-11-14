import { GetStaticProps } from "next";

import { DiffsByVersion } from "../types";
import { getDiffForVersion } from "../remote";
import { ManifestVersion, S3Archive } from "@destiny-definitions/common";

import s from "./indexStyles.module.scss";
import Version from "../components/Version";
import duration from "../lib/duration";

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
  const s3Client = new S3Archive({
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    bucket: process.env.S3_BUCKET ?? "",
    region: process.env.S3_REGION ?? "",
  });

  const indexData = await s3Client.getVersionHistory();
  indexData.reverse();

  const diffsForVersion: DiffsByVersion = {};

  for (const manifestVersion of indexData) {
    const diffData = await getDiffForVersion(manifestVersion.id);
    diffsForVersion[manifestVersion.id] = diffData;
  }

  return {
    props: { versions: indexData, diffsForVersion },
    revalidate: duration("5 minutes"),
  };
};
