import {
  DiffsByVersion,
  AnyDefinitionTable,
  DefinitionDiff,
} from "../../../types";
import { GetStaticProps, GetStaticPaths } from "next";
import { pickBy } from "lodash";

import {
  getVersionsIndex,
  getDiffForVersion,
  getDefinitionForVersion,
} from "../../../remote";

import s from "./styles.module.scss";
import DiffList from "../../../components/DiffList";

interface DefinitionDiffStaticProps {
  versionId: string;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
}

export default function DefinitionDiffPage({
  versionId,
  definitionName,
  diff,
  definitions,
}: DefinitionDiffStaticProps) {
  return (
    <div className={s.root}>
      <h1>Version {versionId}</h1>
      <h2>{definitionName}</h2>

      <DiffList name="Added" hashes={diff.added} definitions={definitions} />
      <DiffList
        name="Unclassified"
        hashes={diff.unclassified}
        definitions={definitions}
      />
      <DiffList
        name="Removed"
        hashes={diff.removed}
        definitions={definitions}
      />
      <DiffList
        name="Reclassified"
        hashes={diff.reclassified}
        definitions={definitions}
      />
    </div>
  );
}

interface Params {
  id: string;
  table: string;
  [key: string]: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const data = await getVersionsIndex();
  if (!data) throw new Error("Unable to get version index");

  const diffsForVersion: DiffsByVersion = {};

  for (const version of data) {
    const diffData = await getDiffForVersion(version.version);
    diffsForVersion[version.version] = diffData;
  }

  const paths = data.flatMap((version) => {
    const diffData = diffsForVersion[version.version] ?? {};

    return Object.entries(diffData)
      .filter(([, diffData]) => Object.values(diffData).some((v) => v.length))
      .map(([table]) => ({
        params: { id: version.version, table },
      }));
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  DefinitionDiffStaticProps,
  Params
> = async (context) => {
  const versionId = context.params?.id ?? "";
  const definitionName = context.params?.table ?? "";

  const allDefinitionDiffs = await getDiffForVersion(versionId);
  if (!allDefinitionDiffs) throw new Error("missing diff data for table page");
  const diff = allDefinitionDiffs[definitionName];
  const hashesInDiff: number[] = Object.values(diff).flatMap((v) => v); // unsure why Object.values

  const definitions = await getDefinitionForVersion(versionId, definitionName);

  if (!definitions) throw new Error("Definitions is missing");
  const pickedDefinitions = pickBy(definitions, (v) =>
    hashesInDiff.includes(v.hash)
  ) as AnyDefinitionTable;

  return {
    props: {
      versionId: versionId,
      definitionName,
      diff,
      definitions: pickedDefinitions,
    },
  };
};

export const config = {
  unstable_runtimeJS: false,
};
