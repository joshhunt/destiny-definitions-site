// run with node 20
import { writeFile, readFile } from "fs/promises";
import * as util from "util";
import path from "path";

interface IndexEntry {
  id: string;
  version: string;
}

const indexPath = path.join(process.env.ARCHIVE_ROOT!, "index.json");
const indexData: IndexEntry[] = JSON.parse(await readFile(indexPath, "utf-8"));

interface PathData {
  version: string;
  id: string;
  diffSummary: Record<string, Record<string, number>>;
}

const pathData: PathData[] = [];

for (const version of indexData) {
  const diffPath = path.join(
    process.env.ARCHIVE_ROOT!,
    "versions",
    version.id,
    "diff.json"
  );
  const diffSummary: Record<string, Record<string, number[]>> = JSON.parse(
    await readFile(diffPath, "utf-8")
  );

  const summarySummary = Object.entries(diffSummary)
    .filter(([tableName, summary]) => {
      const hasChanges = Object.values(summary).some(
        (changes) => changes.length > 0
      );
      return hasChanges;
    })
    .map(([tableName, summary]) => {
      const summarySummary = Object.entries(summary).map(([key, changes]) => [
        key,
        changes.length,
      ]);

      return {
        tableName,
        summary,
      };
    });

  if (summarySummary.length > 0) {
    pathData.push({
      version: version.version,
      id: version.id,
      diffSummary: summarySummary as any,
    });
  }
}

console.log(util.inspect(pathData, { depth: null, colors: true }));

await writeFile(
  path.join(".", "apps", "site", "lib", "pathData.json"),
  JSON.stringify(pathData, null, 2)
);
