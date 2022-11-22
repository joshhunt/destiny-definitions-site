import invariant from "@destiny-definitions/invariant";
import { S3Archive } from "./S3Archive";
import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs/promises";
import {
  DefinitionTable,
  DestinyManifestComponentName,
  GenericDefinition,
} from "../types";
import { uniq } from "lodash";
import { JSONExtractQueryObject, makeJsonExtractQuery } from "./jsonShape";

export class DefinitionsArchive {
  s3ArchiveClient: S3Archive;
  definitionsFolder: string;

  static newFromEnvVars(s3Client?: S3Archive) {
    const defsDir = path.join(process.env.STORAGE_VOLUME ?? "", "definitions");

    return new DefinitionsArchive(
      s3Client ?? S3Archive.newFromEnvVars(),
      defsDir
    );
  }

  constructor(s3ArchiveClient: S3Archive, definitionsFolder: string) {
    invariant(!!definitionsFolder, "Must specify definitionsFolder");

    this.s3ArchiveClient = s3ArchiveClient;
    this.definitionsFolder = definitionsFolder;
  }

  async getDefinition<TableName extends string | DestinyManifestComponentName>(
    versionId: string,
    tableName: TableName,
    hash: number,
    fieldsQuery?: JSONExtractQueryObject
  ): Promise<GenericDefinition> {
    const defsTable = await this.getDefinitions(
      versionId,
      tableName,
      [hash],
      fieldsQuery
    );
    const def = defsTable[hash];

    if (!def) {
      throw new Error(
        "Unable to get definition " + [versionId, tableName, hash].join(":")
      );
    }

    return def;
  }

  async getDefinitions(
    versionId: string,
    tableName: string,
    hashes: number[],
    fieldsQuery?: JSONExtractQueryObject
  ): Promise<DefinitionTable> {
    if (hashes.length === 0) {
      return {};
    }

    const uniqueHashes = uniq(hashes);

    const versionManifest = await this.s3ArchiveClient.getVersionManifest(
      versionId
    );

    const contentPath = versionManifest.mobileWorldContentPaths["en"];
    invariant(contentPath, "Missing english mobileWorldContentPaths");
    const contentFileName = path.basename(contentPath);
    const sqliteFilePath = path.join(this.definitionsFolder, contentFileName);
    const sqliteExists = await fileExists(sqliteFilePath);

    if (!sqliteExists) {
      console.error("Does not exist", sqliteFilePath);
      throw new MissingDefinitionsSqlite();
    }

    const sqliteHashes = uniqueHashes.map((v) => v >> 32);

    const db = new (sqlite3.verbose().Database)(sqliteFilePath);
    let jsonColumn = "json";

    if (fieldsQuery) {
      if (!Object.hasOwn(fieldsQuery, "hash")) {
        throw new Error("Fields query must contain hash");
      }

      const jsonExtract = makeJsonExtractQuery("json", fieldsQuery);
      jsonColumn = `${jsonExtract} as json`;
    }

    const sql = `SELECT id, ${jsonColumn} FROM ${tableName} WHERE id IN ${sqliteList(
      sqliteHashes
    )}`;
    const queryResult = await sqliteAll<{ id: number; json: string }>(db, sql);

    const definitions: Record<string, any> = {};

    for (const row of queryResult) {
      const def = JSON.parse(row.json);
      definitions[def.hash] = def;
    }

    return definitions;
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
