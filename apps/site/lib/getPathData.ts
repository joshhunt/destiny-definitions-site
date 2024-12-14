import { readFile } from "fs/promises";
import path from "path";

export {};

interface PathDataVersion {
  id: string;
  version: string;
  diffSummary: Array<{
    tableName: string;
    summary: Record<string, number[]>;
  }>;
}

export async function getPathData(): Promise<PathDataVersion[]> {
  const pathData = JSON.parse(
    await readFile(path.join(".", "lib", "pathData.json"), "utf-8")
  );

  return pathData;
}
