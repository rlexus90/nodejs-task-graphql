import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { Post as PostsPrisma } from '@prisma/client';

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
  post: {
    type: post,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: (_: unknown, args: PostsPrisma, { prisma }: Context) => {
      return prisma.post.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
};
