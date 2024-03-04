import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../types/context.js';
import DataLoader from 'dataloader';

export const getPostsLoader = (
  info: GraphQLResolveInfo,
  { dataLoaders, prisma }: Context,
) => {
  let dataLoader = dataLoaders.get(info.fieldNodes);
  if (!dataLoader) {
    dataLoader = new DataLoader(async (keys: readonly string[]) => {
      const dbArr = await prisma.post.findMany({
        where: {
          authorId: { in: [...keys] },
        },
      });
      const posts = keys.map((key) => dbArr.filter((post) => post.authorId === key));
      return posts;
    });
    dataLoaders.set(info.fieldNodes, dataLoader);
  }
  return dataLoader;
};
