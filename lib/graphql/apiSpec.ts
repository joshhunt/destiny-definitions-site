import { OpenAPIV3 } from "openapi-types";
import fs from "fs";

declare module "openapi-types" {
  namespace OpenAPIV3 {
    interface NonArraySchemaObject {
      "x-mobile-manifest-name"?: string;
      "x-mapped-definition"?: OpenAPIV3.ReferenceObject;
    }
  }
}

let apiSpec: OpenAPIV3.Document;

export function getApiSpec() {
  if (apiSpec) {
    return apiSpec;
  }

  const specJSON = fs.readFileSync("./api-spec-v3.json").toString();

  apiSpec = JSON.parse(specJSON) as OpenAPIV3.Document;
  return apiSpec;
}

export function getRootSpecs(apiSpec: OpenAPIV3.Document) {
  const types = Object.entries(apiSpec.components?.schemas ?? []).filter(
    ([path, schema]) => {
      if ("$ref" in schema || schema.type === "array") return false;

      return schema["x-mobile-manifest-name"];
    }
  );

  return Object.fromEntries(types) as Record<
    string,
    OpenAPIV3.NonArraySchemaObject
  >;
}

export function nameFromSpecPath(path: string) {
  const bits = path.split(".");
  return bits[bits.length - 1];
}

export function pathFromSpecRef(ref: string) {
  const bits = ref.split("/");
  return bits[bits.length - 1];
}
