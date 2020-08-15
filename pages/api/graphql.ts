import { ApolloServer, gql } from 'apollo-server-micro';

const typeDefs = gql`
  interface Node {
    id: ID!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String!
    endCursor: String!
  }

  type User implements Node {
    id: ID!
    name: String!
  }

  type Group implements Node {
    id: ID!
    name: String!
  }

  type Fund implements Node {
    id: ID!
    name: String!
  }

  type Account implements Node {
    id: ID!
    name: String!
    stripeId: String!
  }

  type Viewer {
    me: User!
  }

  type Query {
    viewer: Viewer!
  }
`;

const resolvers = {
  Query: {
    viewer: async () => {
      return null;
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export default apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};
