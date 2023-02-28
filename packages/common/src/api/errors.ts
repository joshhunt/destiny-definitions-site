export class MissingDefinitionsDatabase extends Error {
  versionID: string;

  constructor(versionID: string) {
    super(`Definitions database is missing for version ${versionID}`);
    this.name = "MissingDefinitionsDatabase";
    this.versionID = versionID;
  }
}

export class InvalidDefinitionTableName extends Error {
  tableName: string;

  constructor(tableName: string) {
    super(`Invalid definition table name ${tableName}`);
    this.name = "InvalidDefinitionTableName";
    this.tableName = tableName;
  }
}

export class MissingDefinitionTable extends Error {
  versionID: string;
  tableName: string;

  constructor(versionID: string, tableName: string) {
    super(
      `Definitions database is missing table ${tableName} for version ${versionID}`
    );
    this.name = "MissingDefinitionTable";
    this.versionID = versionID;
    this.tableName = tableName;
  }
}

export class ErrorOpeningSQLiteDatabase extends Error {
  versionID: string;

  constructor(versionID: string) {
    super(`Unable to open SQLite database for version ${versionID}`);
    this.name = "MissingDefinitionTable";
    this.versionID = versionID;
  }
}

export class VersionNotFoundInHistory extends Error {
  versionID: string;

  constructor(versionID: string) {
    super(`Version ${versionID} not found in history`);
    this.name = "VersionNotFoundInHistory";
    this.versionID = versionID;
  }
}

export type DefinitionsError =
  | MissingDefinitionsDatabase
  | MissingDefinitionTable
  | InvalidDefinitionTableName
  | ErrorOpeningSQLiteDatabase;

export type MaybeAppError<ReturnValue, ErrorType = DefinitionsError> =
  | [ErrorType, null]
  | [null, ReturnValue];
