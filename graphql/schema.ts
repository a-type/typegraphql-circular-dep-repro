import { schema, use } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';
import { auth } from 'nexus-plugin-auth0';
import { shield, rule } from 'nexus-plugin-shield';

use(prisma({ features: { crud: true } }));

use(
  auth({
    auth0Audience: process.env.AUTH0_AUDIENCE,
    auth0Domain: process.env.NEXT_APP_AUTH0_DOMAIN,
  }),
);

const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: NexusContext) => {
    const userId = ctx?.token?.sub;
    return Boolean(userId);
  },
);

const rules = {
  Query: {
    viewer: isAuthenticated,
  },
  Mutation: {
    createOneGroup: isAuthenticated,
    createOneAccount: isAuthenticated,
    // may seem counter-intuitive, but isAuthenticated
    // only checks for an auth0 token
    register: isAuthenticated,
  },
};

use(
  shield({
    rules,
  }),
);

schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.groups();
    t.model.accounts();
  },
});

schema.objectType({
  name: 'Group',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.funds();
    t.model.users();
  },
});

schema.objectType({
  name: 'Fund',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.group();
  },
});

schema.objectType({
  name: 'Account',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.stripeId();
    t.model.user();
  },
});

schema.objectType({
  name: 'Viewer',
  definition(t) {
    t.field('user', {
      nullable: false,
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.db.user.findOne({
          where: {
            id: 'foo',
          },
        });
      },
    });
  },
});

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('ok', {
      nullable: false,
      type: 'Boolean',
      resolve() {
        return true;
      },
    });
    t.field('viewer', {
      nullable: true,
      type: 'Viewer',
      resolve() {
        return null; // TODO
      },
    });
  },
});

schema.inputObjectType({
  name: 'RegisterInput',
  definition(t) {
    t.field('name', {
      nullable: false,
      type: 'String',
    });
  },
});

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneGroup();
    t.crud.createOneAccount();
    t.field('register', {
      nullable: false,
      type: 'User',
      args: {
        input: 'RegisterInput',
      },
      resolve(_, args, ctx) {
        // create a user, linking the auth0 id
        return ctx.db.user.create({
          data: {
            name: args.input.name,
            authSubject: ctx.token.sub,
          },
        });
      },
    });
  },
});
