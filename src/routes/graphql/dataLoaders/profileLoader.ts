import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../types/context.js';

import DataLoader from 'dataloader';

export const getProfileLoader = (
  info: GraphQLResolveInfo,
  { dataLoaders, prisma }: Context,
) => {
  let dataLoader = dataLoaders.get(info.fieldNodes);
  if (!dataLoader) {
    dataLoader = new DataLoader(async (keys: readonly string[]) => {
      const dbArr = await prisma.profile.findMany({
        where: {
          userId: { in: [...keys] },
        },
      });
      const profiles = keys.map((key) => dbArr.find((profile) => profile.userId === key));
      return profiles;
    });
    dataLoaders.set(info.fieldNodes, dataLoader);
  }
  return dataLoader;
};
