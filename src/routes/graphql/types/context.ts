import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export type Context = {
  prisma: PrismaClient;
  dataLoaders: DataLoaders;
};

export type DataLoaders = WeakMap<WeakKey, DataLoader<unknown, unknown>>;
