import { GraphQLFieldResolver } from "graphql";
import { OpenAPIV3 } from "openapi-types";
import { nameFromSpecPath, pathFromSpecRef } from "./apiSpec.js";
import { getDefinition } from "./getDefinitions.js";
import { getRootSchemaNames } from "./createGraphQLSchema.js";

function defWithVersion(def: any, version: string) {
  return {
    ...def,
    $$version: version,
  };
}

const rootSchemaNames = getRootSchemaNames();

export function makeRootDefinitionResolver(_tableName?: string) {
  const resolveFn: GraphQLFieldResolver<unknown, unknown> = async (
    source,
    args,
    context,
    resolveInfo
  ) => {
    const { hash, version, table: tableNameArg } = args;
    const tableName = _tableName ?? tableNameArg;

    if (!tableName) {
      throw new Error(
        "Table name was not specified to makeRootDefinitionResolver"
      );
    }

    const def = await getDefinition(version, tableName, hash);
    return defWithVersion(def, version);
  };

  return resolveFn;
}

export function makeRootMultipleDefinitionResolver(tableName: string) {
  return async (
    _: unknown,
    { hashes, version }: { hashes: string[]; version: string }
  ) => {
    const defs = await Promise.all(
      hashes.map((hash) => getDefinition(version, tableName, hash))
    );

    const toReturn = defs.map((def) => defWithVersion(def, version));
    return toReturn;
  };
}

export function makeResolver(
  name: string,
  property: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
) {
  const resolveFn: GraphQLFieldResolver<any, unknown> = async (
    source,
    args,
    context,
    info
  ) => {
    const version = source.$$version || info.variableValues.version;

    if (!version) {
      throw new Error("Version not on source object");
    }

    if (
      !("x-mapped-definition" in property) ||
      !property["x-mapped-definition"]
    ) {
      throw new Error("Property does not have x-mapped-definition");
    }

    const tableName = nameFromSpecPath(
      pathFromSpecRef(property["x-mapped-definition"].$ref)
    );

    const hash = source[name];

    if (!hash) {
      return null;
    }

    const def = await getDefinition(version, tableName, hash);
    return defWithVersion(def, version);
  };

  return resolveFn;
}
