import { DocumentNode, graphql } from "graphql";

import { schema } from "./schema";

function getGqlString(doc: DocumentNode) {
  if (!doc.loc) {
    throw new Error("query does not have loc");
  }

  return doc.loc.source.body;
}

export default async function queryGraphql<TData, TVariables = any>(
  query: string | DocumentNode,
  variableValues: TVariables
): Promise<TData> {
  const queryString = typeof query === "string" ? query : getGqlString(query);
  const result = await graphql({
    schema,
    source: queryString,
    variableValues: variableValues ?? {},
  });

  if (result.errors) {
    result.errors.forEach((err) => console.error(err));
    throw result.errors[0];
  }
  const { data } = result;

  return data as TData;
}
