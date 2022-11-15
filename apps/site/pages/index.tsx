import { GetStaticProps } from "next";

import {
  ManifestVersion,
  S3Archive,
  VersionDiff,
} from "@destiny-definitions/common";

import s from "./indexStyles.module.scss";
import Version from "../components/Version";
import duration from "../lib/duration";

interface HomeStaticProps {
  versions: ManifestVersion[];
  diffsForVersion: Record<string, VersionDiff>;
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

const PAGE_SIZE = 10;

export const getStaticProps: GetStaticProps<HomeStaticProps> = async (
  context
) => {
  console.log(context);
  const pageParam = context.params?.pageNumber ?? "0";
  const pageNumber = parseInt(
    typeof pageParam === "string" ? pageParam : pageParam[0]
  );

  const s3Client = new S3Archive({
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    bucket: process.env.S3_BUCKET ?? "",
    region: process.env.S3_REGION ?? "",
  });

  const indexData = await s3Client.getVersionHistory();
  indexData.reverse();

  const indexStart = pageNumber * PAGE_SIZE;
  const indexEnd = indexStart + PAGE_SIZE;

  const pageVersions = indexData.slice(indexStart, indexEnd);

  const diffsForVersion: Record<string, VersionDiff> = {};

  for (const manifestVersion of pageVersions) {
    const diffData = await s3Client.getVersionDiff(manifestVersion.id);
    diffsForVersion[manifestVersion.id] = diffData;
  }

  return {
    props: { versions: indexData, diffsForVersion },
    revalidate: duration("5 minutes"),
  };
};
