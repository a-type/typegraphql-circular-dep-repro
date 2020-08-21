import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';

@Service()
export class PrismaService {
  client: PrismaClient = new PrismaClient();
}
