import { PrismaClient } from '@prisma/client';

export type Token = {
  uid: string;
};

export type Context = {
  prisma: PrismaClient;
  token: Token;
};
