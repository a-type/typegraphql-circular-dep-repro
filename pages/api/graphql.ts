import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { PrismaClient } from '@prisma/client';
import {
  UserRelationsResolver,
  GroupRelationsResolver,
  AccountRelationsResolver,
  FundRelationsResolver,
  CreateUserResolver,
  CreateAccountResolver,
  CreateGroupResolver,
  CreateFundResolver,
} from '../../@generated/type-graphql';
import {
  ViewerFieldsResolver,
  ViewerQueryResolver,
} from '../../graphql/schema';

const prisma = new PrismaClient();

const serverPromise = (async function() {
  const schema = await buildSchema({
    resolvers: [
      CreateUserResolver,
      CreateGroupResolver,
      CreateAccountResolver,
      CreateFundResolver,
      UserRelationsResolver,
      GroupRelationsResolver,
      AccountRelationsResolver,
      FundRelationsResolver,
      ViewerFieldsResolver,
      ViewerQueryResolver,
    ],
    // I think it's needed for typegraphql-prisma
    validate: false,
    emitSchemaFile: true,
    // 3rd party dependency injection container
    container: Container,
  });

  return new ApolloServer({ schema, context: () => ({ prisma }) });
})();

export default async function(req: any, res: any) {
  const apolloServer = await serverPromise;
  const handler = apolloServer.createHandler({ path: '/api/graphql' });
  return handler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
