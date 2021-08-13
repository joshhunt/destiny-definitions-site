import { ApolloServer } from "apollo-server-micro";
import createGraphQLSchema from "./definitions-graphql/createGraphQLSchema";

export const schema = createGraphQLSchema();

const apolloServer = new ApolloServer({ schema });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
