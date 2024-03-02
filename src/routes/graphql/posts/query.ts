import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';

const post = new GraphQLObjectType({
  name: 'post',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
});

export const postsQuery = {
  posts: {
    type: new GraphQLList(post),
    resolve: (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.post.findMany();
    },
  },
};
