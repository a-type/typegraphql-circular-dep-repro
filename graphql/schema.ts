import 'reflect-metadata';
import {
  ObjectType,
  ID,
  Field,
  InputType,
  Resolver,
  Query,
  Root,
  FieldResolver,
  Args,
  Ctx,
} from 'type-graphql';
import { User } from '../@generated/type-graphql';
import { Context } from './types';

@ObjectType()
export class Viewer {
  @Field((type) => User)
  user: User;
}

@Resolver((of) => Viewer)
export class ViewerFieldsResolver {
  @FieldResolver()
  async user(@Ctx() { prisma, token }: Context): Promise<User | null> {
    if (!token) return null;

    return await prisma.user.findOne({
      where: {
        id: token.uid,
      },
    });
  }
}

@Resolver()
export class ViewerQueryResolver {
  @Query((returns) => Viewer, { nullable: true })
  async viewer(@Ctx() { prisma, token }: Context): Promise<Viewer | null> {
    if (!token) return null;

    return new Viewer();
  }
}
