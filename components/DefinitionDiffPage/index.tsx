import {
  DefinitionDiff,
  AnyDefinitionTable,
  ManifestVersion,
  ItemCategoryValues,
} from "../../types";
import { format } from "date-fns";
import { friendlyDiffName } from "../../lib/utils";
import DiffList from "../DiffList";
import { doGrouping } from "./categorise";
import IndexTable from "../IndexTable";

import s from "./styles.module.scss";

interface DefinitionDiffStaticProps {
  versionId: string;
  manifestVersion: ManifestVersion;
  definitionName: string;
  diff: DefinitionDiff;
  definitions: AnyDefinitionTable;
  previousDefinitions: AnyDefinitionTable | null;
}

export default function DefinitionDiffPage({
  versionId,
  manifestVersion,
  definitionName,
  diff,
  definitions,
  previousDefinitions,
}: DefinitionDiffStaticProps) {
  const groupedDiff = doGrouping(
    diff,
    definitions,
    previousDefinitions,
    definitionName
  );

  const indexData = Object.entries(groupedDiff)
    .map(([diffSectionName, groupedHashes]) => {
      return {
        name: diffSectionName,
        count: Array.isArray(groupedHashes)
          ? groupedHashes.length
          : Object.values(groupedHashes).reduce((acc, n) => acc + n.length, 0),
        subItems: Array.isArray(groupedHashes)
          ? null
          : Object.entries(groupedHashes)
              .map(([itemCategory, hashes]) => {
                return {
                  name: itemCategory,
                  count: hashes.length,
                };
              })
              .sort((a, b) => {
                return (
                  ItemCategoryValues.indexOf(a.name) -
                  ItemCategoryValues.indexOf(b.name)
                );
              }),
      };
    })
    .filter((v) => v.count > 0);

  return (
    <div className={s.root}>
      <div className={s.main}>
        <h2 className={s.pageTitle}>
          {friendlyDiffName(definitionName)},{" "}
          {format(new Date(manifestVersion.createdAt), "E do MMM, u")}
        </h2>

        <DiffList
          name="Added"
          hashes={groupedDiff.added}
          definitions={definitions}
        />

        <DiffList
          name="Unclassified"
          hashes={groupedDiff.unclassified}
          definitions={definitions}
        />

        <DiffList
          name="Removed"
          hashes={groupedDiff.removed}
          definitions={previousDefinitions || definitions}
        />

        <DiffList
          name="Reclassified"
          hashes={groupedDiff.reclassified}
          definitions={previousDefinitions || definitions}
        />
      </div>

      <div className={s.side}>
        <div className={s.stickySide}>
          <IndexTable data={indexData} />
        </div>
      </div>
    </div>
  );
}
