import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../types/context.js';
import DataLoader from 'dataloader';

export const getUserSubscribedToLoader = (
  info: GraphQLResolveInfo,
  { dataLoaders, prisma }: Context,
) => {
  let dataLoader = dataLoaders.get(info.fieldNodes);
  if (!dataLoader) {
    dataLoader = new DataLoader(async (keys: readonly string[]) => {
      const dbArr = await prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: { in: [...keys] },
            },
          },
        },
        include: {
          subscribedToUser: true,
        },
      });
      const subscribes = keys.map((key) =>
        dbArr.filter((user) => user.subscribedToUser[0].subscriberId === key),
      );
      return subscribes;
    });
    dataLoaders.set(info.fieldNodes, dataLoader);
  }
  return dataLoader;
};
