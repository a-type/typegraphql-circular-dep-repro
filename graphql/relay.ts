import 'reflect-metadata';
import * as Relay from 'graphql-relay';
import { ArgsType, Field, ObjectType } from 'type-graphql';
import { TypeValue } from 'type-graphql/dist/decorators/types';

export type ConnectionCursor = Relay.ConnectionCursor;

@ObjectType()
export class PageInfo implements Relay.PageInfo {
  @Field()
  hasNextPage!: boolean;
  @Field()
  hasPreviousPage!: boolean;
  @Field((type) => String)
  startCursor?: ConnectionCursor;
  @Field((type) => String)
  endCursor?: ConnectionCursor;
}

export function connectionTypes<T extends TypeValue>(
  name: string,
  nodeType: T,
) {
  @ObjectType(`${name}Edge`)
  class Edge implements Relay.Edge<T> {
    @Field(() => nodeType)
    node!: T;

    @Field((type) => String, {
      description: 'Used in `before` and `after` args',
    })
    cursor!: ConnectionCursor;
  }

  @ObjectType(`${name}Connection`)
  class Connection implements Relay.Connection<T> {
    @Field()
    pageInfo!: PageInfo;

    @Field(() => [Edge])
    edges!: Edge[];
  }
  return {
    Connection,
    Edge,
  };
}

/**
 * TODO: Figure out how to validate this with class-validator
 * https://github.com/typestack/class-validator/issues/269
 */
@ArgsType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field((type) => String, {
    nullable: true,
    description: 'Paginate before opaque cursor',
  })
  before?: ConnectionCursor;
  @Field((type) => String, {
    nullable: true,
    description: 'Paginate after opaque cursor',
  })
  after?: ConnectionCursor;
  @Field({ nullable: true, description: 'Paginate first' })
  first?: number;
  @Field({ nullable: true, description: 'Paginate last' })
  last?: number;

  get pagingParams() {
    return getPagingParameters(this);
  }
}

type PagingMeta =
  | { pagingType: 'forward'; after?: string; first: number }
  | { pagingType: 'backward'; before?: string; last: number }
  | { pagingType: 'none' };

function checkPagingSanity(args: ConnectionArgs): PagingMeta {
  const { first = 0, last = 0, after, before } = args;
  const isForwardPaging = !!first || !!after;
  const isBackwardPaging = !!last || !!before;

  if (isForwardPaging && isBackwardPaging) {
    throw new Error('cursor-based pagination cannot be forwards AND backwards');
  }
  if ((isForwardPaging && before) || (isBackwardPaging && after)) {
    throw new Error('paging must use either first/after or last/before');
  }
  if ((isForwardPaging && first < 0) || (isBackwardPaging && last < 0)) {
    throw new Error('paging limit must be positive');
  }
  // This is a weird corner case. We'd have to invert the ordering of query to get the last few items then re-invert it when emitting the results.
  // We'll just ignore it for now.
  if (last && !before) {
    throw new Error("when paging backwards, a 'before' argument is required");
  }
  return isForwardPaging
    ? { pagingType: 'forward', after, first }
    : isBackwardPaging
    ? { pagingType: 'backward', before, last }
    : { pagingType: 'none' };
}

const getId = (cursor: ConnectionCursor) =>
  parseInt(Relay.fromGlobalId(cursor).id, 10);
const nextId = (cursor: ConnectionCursor) => getId(cursor) + 1;

/**
 * Create a 'paging parameters' object with 'limit' and 'offset' fields based on the incoming
 * cursor-paging arguments.
 *
 * TODO: Handle the case when a user uses 'last' alone.
 */
function getPagingParameters(args: ConnectionArgs) {
  const meta = checkPagingSanity(args);

  switch (meta.pagingType) {
    case 'forward': {
      return {
        limit: meta.first,
        offset: meta.after ? nextId(meta.after) : 0,
      };
    }
    case 'backward': {
      const { last, before } = meta;
      let limit = last;
      let offset = getId(before!) - last;

      // Check to see if our before-page is underflowing past the 0th item
      if (offset < 0) {
        // Adjust the limit with the underflow value
        limit = Math.max(last + offset, 0);
        offset = 0;
      }

      return { offset, limit };
    }
    default:
      return {};
  }
}
