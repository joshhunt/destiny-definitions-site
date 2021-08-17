import * as graphql from "graphql";
import { OpenAPIV3 } from "openapi-types";
import { GraphQLJSONObject } from "graphql-type-json";
import {
  getApiSpec,
  getRootSpecs,
  nameFromSpecPath,
  pathFromSpecRef,
} from "./apiSpec";
import {
  makeResolver,
  makeRootDefinitionResolver,
  makeRootMultipleDefinitionResolver,
} from "./resolvers";

type OpenAPISchemaProperties = Exclude<
  OpenAPIV3.BaseSchemaObject["properties"],
  undefined
>;
type OpenAPISchemaProperty = OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
type GraphQLFieldConfig = graphql.GraphQLFieldConfig<unknown, unknown>;

function fieldTypeForProperty(
  apiSpec: OpenAPIV3.Document,
  propertyName: string,
  propertySpec: OpenAPISchemaProperty
): graphql.GraphQLOutputType | undefined {
  if ("$ref" in propertySpec) {
    const nestedPath = pathFromSpecRef(propertySpec.$ref);
    return createSchemaFromSpec(apiSpec, nestedPath);
  }

  if (propertySpec.type === "object" && propertySpec.allOf?.length === 1) {
    if ("$ref" in propertySpec.allOf[0]) {
      const nestedPath = pathFromSpecRef(propertySpec.allOf[0].$ref);
      return createSchemaFromSpec(apiSpec, nestedPath);
    }
  }

  if (propertySpec.type === "array") {
    const childType = fieldTypeForProperty(
      apiSpec,
      propertyName,
      propertySpec.items
    );

    if (childType) {
      return new graphql.GraphQLList(childType);
    } else {
      console.warn("Missing type for", propertyName, propertySpec);
    }
  }

  if (propertySpec.type === "integer") {
    return propertySpec.format === "uint32"
      ? graphql.GraphQLFloat
      : graphql.GraphQLInt;
  }

  if (propertySpec.type === "number" && propertySpec.format === "float") {
    return graphql.GraphQLFloat;
  }

  if (propertySpec.type === "boolean") {
    return graphql.GraphQLBoolean;
  }

  if (propertySpec.type === "string") {
    return graphql.GraphQLString;
  }

  // console.warn(
  //   `Property ${propertyName} of type ${propertySpec.type} not mapped to a GraphQL type`,
  //   propertySpec
  // );
}

function createFieldsFromSpecProperties(
  apiSpec: OpenAPIV3.Document,
  properties: OpenAPISchemaProperties
): graphql.GraphQLFieldConfigMap<unknown, unknown> {
  const fields: graphql.GraphQLFieldConfigMap<unknown, unknown> = {};

  for (const [propName, propSchema] of Object.entries(properties)) {
    const graphqlType = fieldTypeForProperty(apiSpec, propName, propSchema);

    if (graphqlType) {
      fields[propName] = {
        description:
          "description" in propSchema ? propSchema.description : undefined,
        type: graphqlType,
      };
    }

    // Check if this field is a hash that references another table, and apply that relationship inline
    if (
      "x-mapped-definition" in propSchema &&
      propSchema["x-mapped-definition"]
    ) {
      const referencePath = pathFromSpecRef(
        propSchema["x-mapped-definition"].$ref
      );

      const mappedPropertyName = propName
        .replace(/Hash$/, "")
        .replace(/Hashes$/, "");

      fields[mappedPropertyName] = {
        type: createSchemaFromSpec(apiSpec, referencePath),
        resolve: makeResolver(propName, propSchema),
      };
    }
  }

  if (Object.keys(fields).length < 1) {
    fields.thisObjectHasNoFields = { type: graphql.GraphQLString };
  }

  return fields;
}

const cache: Record<string, graphql.GraphQLObjectType<unknown, unknown>> = {};
// formally resolveSpecToGraphQLSchema
function createSchemaFromSpec(apiSpec: OpenAPIV3.Document, specPath: string) {
  if (cache[specPath]) {
    return cache[specPath];
  }

  const schema = apiSpec.components?.schemas?.[specPath];
  const name = nameFromSpecPath(specPath);

  if (!schema) throw new Error(`Could not find schema for path ${specPath}`);
  if ("$ref" in schema) throw new Error(`Schema at path ${specPath} is a ref`);
  if (!schema.properties)
    throw new Error(`Schema at path ${specPath} has no properties`);

  const graphqlType = new graphql.GraphQLObjectType({
    name: name,
    fields: () =>
      createFieldsFromSpecProperties(
        apiSpec,
        schema.properties as OpenAPISchemaProperties // TODO: type
      ),
  });

  cache[specPath] = graphqlType;

  return graphqlType;
}

function createDefinitionSchema(
  schema: graphql.GraphQLObjectType<unknown, unknown>,
  name: string
): GraphQLFieldConfig {
  return {
    args: {
      hash: { type: graphql.GraphQLString },
      version: { type: graphql.GraphQLString },
    },
    type: schema,
    resolve: makeRootDefinitionResolver(name),
  };
}

function createMultipleDefinitionSchema(
  schema: graphql.GraphQLObjectType<unknown, unknown>,
  name: string
): GraphQLFieldConfig {
  return {
    args: {
      hashes: { type: new graphql.GraphQLList(graphql.GraphQLString) },
      version: { type: graphql.GraphQLString },
    },
    type: new graphql.GraphQLList(schema),
    resolve: makeRootMultipleDefinitionResolver(name) as any, // TODO: type
  };
}

function createJSONDefinitionSchema(): GraphQLFieldConfig {
  const type = GraphQLJSONObject;

  return {
    args: {
      table: { type: graphql.GraphQLString },
      hash: { type: graphql.GraphQLString },
      version: { type: graphql.GraphQLString },
    },
    type: type,
    resolve: makeRootDefinitionResolver(),
  };
}

export default function makeGraphQLSchema() {
  const apiSpec = getApiSpec();
  const rootSpecs = getRootSpecs(apiSpec);

  // console.log("spec", apiSpec);
  // console.log(`Root types:`, Object.keys(rootSpecs));

  const queryFields: graphql.GraphQLFieldConfigMap<any, any> = {};

  for (const path of Object.keys(rootSpecs)) {
    const name = nameFromSpecPath(path);
    if (!name) continue;

    const schema = createSchemaFromSpec(apiSpec, path);

    const definitionSchema = createDefinitionSchema(schema, name);
    const multipleDefsSchema = createMultipleDefinitionSchema(schema, name);

    queryFields[name] = definitionSchema;
    queryFields[`Many${name}`] = multipleDefsSchema;
  }

  queryFields.JSONDefinition = createJSONDefinitionSchema();

  const queryType = new graphql.GraphQLObjectType({
    name: "Query",
    fields: queryFields,
  });

  return new graphql.GraphQLSchema({ query: queryType });
}
