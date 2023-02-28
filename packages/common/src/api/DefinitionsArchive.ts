import invariant from "@destiny-definitions/invariant";
import { S3Archive } from "./S3Archive";
import path from "path";
import sqlite3, { Database } from "sqlite3";
import fs from "fs/promises";
import {
  DefinitionTable,
  DestinyManifestComponentName,
  GenericDefinition,
} from "../types";
import { uniq } from "lodash";
import { JSONExtractQueryObject, makeJsonExtractQuery } from "./jsonShape";
import {
  ErrorOpeningSQLiteDatabase,
  InvalidDefinitionTableName,
  MaybeAppError,
  MissingDefinitionsDatabase,
  MissingDefinitionTable,
} from "./errors";

const TABLE_NAME_RE = /Destiny\w+Definition/;

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
  ): Promise<MaybeAppError<GenericDefinition>> {
    const [err, defsTable] = await this.getDefinitions(
      versionId,
      tableName,
      [hash],
      fieldsQuery
    );

    if (err) {
      return [err, null];
    }

    const def = defsTable[hash];

    if (!def) {
      throw new Error(
        "Unable to get definition " + [versionId, tableName, hash].join(":")
      );
    }

    return [null, def];
  }

  async getDefinitions(
    versionId: string,
    tableName: string,
    hashes: number[],
    fieldsQuery?: JSONExtractQueryObject
  ): Promise<MaybeAppError<DefinitionTable>> {
    const tableNameIsValid = TABLE_NAME_RE.test(tableName);
    if (!tableNameIsValid) {
      return [new InvalidDefinitionTableName(tableName), null];
    }

    if (hashes.length === 0) {
      return [null, {}];
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
      return [new MissingDefinitionsDatabase(versionId), null];
    }

    let db: Database;

    try {
      db = new (sqlite3.verbose().Database)(sqliteFilePath);
    } catch (err) {
      return [new ErrorOpeningSQLiteDatabase(versionId), null];
    }

    const tableCheckSql = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?;",
      tableName
    );
    let tableCheckResult: { name: string } | undefined;

    try {
      tableCheckResult = await sqliteGet<{ name: string }>(tableCheckSql);
    } catch (err) {
      console.log("failed to sql on", sqliteFilePath);
      throw err;
    }

    if (!tableCheckResult || tableCheckResult.name !== tableName) {
      return [new MissingDefinitionTable(versionId, tableName), null];
    }

    let jsonColumn = "json";

    if (fieldsQuery) {
      if (!Object.hasOwn(fieldsQuery, "hash")) {
        throw new Error("Fields query must contain hash");
      }

      const jsonExtract = makeJsonExtractQuery("json", fieldsQuery);
      jsonColumn = `${jsonExtract} as json`;
    }

    const sqliteHashes = uniqueHashes.map((v) => v >> 32);
    const hashParams = new Array(sqliteHashes.length).fill("?").join(", ");
    const statement = db.prepare(
      `SELECT id, ${jsonColumn} FROM ${tableName} WHERE id IN (${hashParams})`,
      ...sqliteHashes
    );

    const queryResult = await sqliteAll<{ id: number; json: string }>(
      statement
    );

    const definitions: Record<string, any> = {};

    for (const row of queryResult) {
      const def = JSON.parse(row.json);
      definitions[def.hash] = def;
    }

    return [null, definitions];
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

function sqliteGet<T>(statement: sqlite3.Statement): Promise<T | undefined> {
  return new Promise<T>((resolve, reject) => {
    statement.get((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function sqliteAll<T>(statement: sqlite3.Statement): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const callback = (err: unknown, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T[]);
      }
    };

    statement.all(callback);
  });
}

process.on("uncaughtException", function (err) {
  console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error(err.stack);
  process.exit(1);
});
