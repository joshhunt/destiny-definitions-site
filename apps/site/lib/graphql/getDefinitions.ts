import path from "path";
import sqliteFactory from "sqlite3";

const sqlite3 = sqliteFactory.verbose();
const dbPath = "./world_sql_content_c0b6f372037834a3fc8e8f12c3b02363.content";
const db = new sqlite3.Database(dbPath);

const DATABASES_FOLDER = path.resolve("./databases");

function getSqliteDefinition(
  db: sqliteFactory.Database,
  tableName: string,
  hash: string
) {
  return new Promise((resolve, reject) => {
    const id = parseInt(hash) >> 32;

    const sql = `SELECT id, json FROM ${tableName} WHERE id = ${id};`;
    db.get(sql, (error, data) => {
      if (error) {
        return reject(error);
      }

      if (!data) {
        return reject(
          new Error(`Could not find ${tableName} hash ${hash} id ${id}`)
        );
      }

      resolve(JSON.parse(data.json));
    });
  });
}

export async function getDefinition(
  version: string,
  tableName: string,
  hash: string
) {
  return getSqliteDefinition(db, tableName, hash);
}
