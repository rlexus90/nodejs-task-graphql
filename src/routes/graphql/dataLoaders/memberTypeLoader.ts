import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../types/context.js';

import DataLoader from 'dataloader';

export const getMemberTypeLoader = (
  info: GraphQLResolveInfo,
  { dataLoaders, prisma }: Context,
) => {
  let dataLoader = dataLoaders.get(info.fieldNodes);
  if (!dataLoader) {
    dataLoader = new DataLoader(async (keys: readonly string[]) => {
      const dbArr = await prisma.memberType.findMany();
      const members = keys.map((key) =>
        dbArr.find((memberType) => memberType.id === key),
      );
      return members;
    });
    dataLoaders.set(info.fieldNodes, dataLoader);
  }
  return dataLoader;
};
