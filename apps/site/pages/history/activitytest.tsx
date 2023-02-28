import {
  DefinitionsArchive,
  GenericDefinition,
  ManifestVersion,
  S3Archive,
} from "@destiny-definitions/common";
import { DestinyActivityDefinition } from "bungie-api-ts/destiny2";
import { FormatDate } from "../../components/DateTimeFormatters";

export default function ActivityHistoryTestPage({
  history,
}: {
  history: [ManifestVersion, GenericDefinition][];
}) {
  return (
    <div>
      <h1>Activity test</h1>

      {history?.map(([version, definition]) => {
        return (
          <h4>
            <FormatDate date={version.createdAt} />{" "}
          </h4>
        );
      })}
    </div>
  );
}

const ACTIVITY_HASH = 1558196345;

export async function getStaticProps() {
  const s3Client = S3Archive.newFromEnvVars();
  const defsClient = DefinitionsArchive.newFromEnvVars(s3Client);

  console.log("getting version history");
  const versions = await s3Client.getVersionHistory();

  const history: [ManifestVersion, GenericDefinition][] = [];

  console.log("sorting versions");
  versions.sort((a, b) => {
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);

    return bDate.getTime() - aDate.getTime();
  });

  for (const version of versions) {
    console.log("Looking in version " + version.id + " " + version.createdAt);
    try {
      const [defErr, definition] = await defsClient.getDefinition(
        version.id,
        "DestinyActivityDefinition",
        ACTIVITY_HASH
      );

      if (definition) {
        history.push([version, definition]);
      }
    } catch {}
  }

  return {
    props: {
      history: history,
    },
  };
}
