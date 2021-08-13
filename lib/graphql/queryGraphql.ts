import { DocumentNode, graphql } from "graphql";

import { schema } from "../../pages/api/graphql";

function getGqlString(doc: DocumentNode) {
  if (!doc.loc) {
    throw new Error("query does not have loc");
  }

  return doc.loc.source.body;
}

export default async function queryGraphql(
  query: string | DocumentNode,
  variableValues = {}
) {
  const queryString = typeof query === "string" ? query : getGqlString(query);
  const result = await graphql({ schema, source: queryString, variableValues });
  const { data } = result;
  return data;
}
