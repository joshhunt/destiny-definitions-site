import invariant from "@destiny-definitions/invariant";
import { S3Archive } from "./S3Archive";
import path from "path";
import sqlite3, { Database } from "sqlite3";
import fs from "fs/promises";
import {
  AllDestinyManifestComponents,
  DefinitionTable,
  DestinyManifestComponentName,
  GenericDefinition,
} from "../definitionsTypes";
import { uniq, merge } from "lodash";
import { JSONExtractQueryObject, makeJsonExtractQuery } from "./jsonShape";
import {
  ErrorOpeningSQLiteDatabase,
  InvalidDefinitionTableName,
  MaybeAppError,
  MissingDefinitionsDatabase,
  MissingDefinitionTable,
} from "./errors";

const TABLE_NAME_RE = /Destiny\w+Definition/;

const AMMO_TYPES: [hash: number, ammoType: number][] = [
  [231031173, 1],
  [484515708, 1],
  [1471212226, 2],
  [135029084, 2],
  [1491665733, 3],
  [2972949637, 3],
];

export class DefinitionsArchive {
  s3ArchiveClient: S3Archive;
  definitionsFolder: string;
  additionalDefinitions: AllDestinyManifestComponents = {};
  altDefsUrlBase?: string;

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

  async loadAdditionalDefinitions(urlBase: string, path: string) {
    this.altDefsUrlBase = urlBase;
    const url = urlBase + path;

    const resp = await fetch(url);
    this.additionalDefinitions = await resp.json();
    const itemDefs = this.additionalDefinitions.DestinyInventoryItemDefinition;
    if (itemDefs) {
      for (const [itemHash, ammoType] of AMMO_TYPES) {
        if (itemDefs[itemHash]?.equippingBlock) {
          (itemDefs[itemHash] as any).equippingBlock.ammoType = ammoType;
        }
      }
    }
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
      fieldsQuery.redacted = 1;

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
      let def = JSON.parse(row.json);

      if (def.redacted) {
        const additionalDef =
          this.additionalDefinitions[
            tableName as DestinyManifestComponentName
          ]?.[def.hash];

        if (additionalDef && this.altDefsUrlBase) {
          processAdditionalDefinition(additionalDef, this.altDefsUrlBase);
          merge(def, additionalDef);
        }
      }

      definitions[def.hash] = def;
    }

    // Add defs missing from the database
    for (const hash of hashes) {
      if (definitions[hash]) {
        continue;
      }

      const additionalDef =
        this.additionalDefinitions[tableName as DestinyManifestComponentName]?.[
          hash
        ];

      if (additionalDef && this.altDefsUrlBase) {
        processAdditionalDefinition(additionalDef, this.altDefsUrlBase);
        definitions[additionalDef.hash!] = additionalDef;
      }
    }

    return [null, definitions];
  }
}

function processAdditionalDefinition(additionalDef: any, urlBase: string) {
  if (additionalDef.displayProperties?.icon) {
    additionalDef.displayProperties.icon = fixIcon(
      urlBase,
      additionalDef.displayProperties.icon
    );
  }

  if (additionalDef.displayProperties?.iconSequences) {
    additionalDef.displayProperties.iconSequences =
      additionalDef.displayProperties.iconSequences.map((seq: any) => {
        if (!seq.frames) {
          return seq;
        }
        return {
          ...seq,
          frames: seq.frames.map((v: string) => fixIcon(urlBase!, v)),
        };
      });
  }
}

function fixIcon(base: string, path: string) {
  return base + path.replace(/\\/g, "/");
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
