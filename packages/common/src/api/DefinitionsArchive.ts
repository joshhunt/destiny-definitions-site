import { ManifestVersion } from "../types";
import invariant from "tiny-invariant";
import { S3Archive } from "./S3Archive";
import path from "path";
import lodash from "lodash";
import sqlite3 from "sqlite3";
import fs from "fs/promises";

export class DefinitionsArchive {
  s3ArchiveClient: S3Archive;
  definitionsFolder: string;

  constructor(s3ArchiveClient: S3Archive, definitionsFolder: string) {
    this.s3ArchiveClient = s3ArchiveClient;
    this.definitionsFolder = definitionsFolder;
  }

  async getDefinitions<Table = any>(
    version: ManifestVersion,
    tableName: string,
    hashes: number[],
    paths: Array<string>
  ): Promise<Record<string, Table>> {
    const versionManifest = await this.s3ArchiveClient.getVersionManifest(
      version.id
    );

    const contentPath = versionManifest.mobileWorldContentPaths["en"];
    invariant(contentPath, "Missing english mobileWorldContentPaths");
    const contentFileName = path.basename(contentPath);
    const sqliteFilePath = path.join(this.definitionsFolder, contentFileName);
    const sqliteExists = await fileExists(sqliteFilePath);

    if (!sqliteExists) {
      throw new MissingDefinitionsSqlite();
    }

    const sqliteHashes = hashes.map((v) => v >> 32);

    const jsonSelects = paths.map((prop) => {
      const key = String(prop);

      return {
        key,
        select: `json_extract(json, '$.${key}') as "${key}"`,
      };
    });

    const jsonExtractSql = jsonSelects.map((v) => v.select).join(", ");

    const db = new (sqlite3.verbose().Database)(sqliteFilePath);
    const sql = `SELECT ${jsonExtractSql} FROM ${tableName} WHERE id IN ${sqliteList(
      sqliteHashes
    )}`;
    const queryResult = await sqliteAll<Record<string, string>>(db, sql);

    const allDefinitions: Record<string, any> = {};

    for (const resultObject of queryResult) {
      const def: any = {};

      for (const key in resultObject) {
        lodash.set(def, key, parseJsonExtractValue(resultObject[key]));
      }

      allDefinitions[def.hash] = def;
    }

    return allDefinitions;
  }
}

async function fileExists(path: string) {
  try {
    const stat = await fs.stat(path);
    return !!stat;
  } catch {
    return false;
  }
}

function parseJsonExtractValue(v: string | undefined) {
  if (!v) {
    return undefined;
  }

  try {
    return JSON.parse(v);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return v;
    }

    throw new Error(v);
  }
}

function sqliteList(list: Array<string | number>) {
  return "(" + list.join(", ") + ")";
}

// function sqliteGet<T>(db: sqlite3.Database, sql: string): Promise<T> {
//   return new Promise((resolve, reject) => {
//     db.get(sql, (err: unknown, row: any) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(row as T);
//       }
//     });
//   });
// }

function sqliteAll<T>(db: sqlite3.Database, sql: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err: unknown, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T[]);
      }
    });
  });
}

export class MissingDefinitionsSqlite extends Error {
  constructor() {
    super("MissingDefinitionsSqlite");
    this.name = "MissingDefinitionsSqlite";
  }
}
