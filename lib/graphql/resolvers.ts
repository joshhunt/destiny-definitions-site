import { GraphQLFieldResolver } from "graphql";
import { OpenAPIV3 } from "openapi-types/dist/index";
import { nameFromSpecPath, pathFromSpecRef } from "./apiSpec";
import { getDefinition } from "./getDefinitions";

type Arguments = Record<string, string>;

function defWithVersion(def: any, version: string) {
  return {
    ...def,
    $$version: version,
  };
}

export function makeRootDefinitionResolver(tableName: string) {
  return async (_: unknown, { hash, version }: Arguments) => {
    const def = await getDefinition(version, tableName, hash);
    return defWithVersion(def, version);
  };
}

export function makeRootMultipleDefinitionResolver(tableName: string) {
  return async (
    _: unknown,
    { hashes, version }: { hashes: string[]; version: string }
  ) => {
    console.log("makeRootMultipleDefinitionResolver", { hashes, version });
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
  const resolveFn: GraphQLFieldResolver<any, any> = async (
    source,
    args,
    context,
    info
  ) => {
    const version = source.$$version || info.variableValues.version;

    if (!version) {
      console.log("info:");
      console.log(info);
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
