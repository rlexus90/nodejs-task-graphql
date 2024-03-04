import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { User as UserPrisma } from '@prisma/client';
import { post } from '../posts/query.js';
import { profile } from '../profiles/query.js';
import { getPostsLoader } from '../dataLoaders/postsLoader.js';
import { getProfileLoader } from '../dataLoaders/profileLoader.js';
import { getUserSubscribedToLoader } from '../dataLoaders/userSubscribedToLoader.js';
import { getSubscribedToUserLoader } from '../dataLoaders/subscribedToUserLoader.js';

export const user: GraphQLObjectType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    posts: {
      type: new GraphQLList(post),
      resolve: (obj: UserPrisma, _: unknown, context: Context, info) => {
        const dataLoader = getPostsLoader(info, context);

        // return context.prisma.post.findMany({
        //   where: {
        //     authorId: obj.id,
        //   },
        // });

        return dataLoader.load(obj.id);
      },
    },
    profile: {
      type: profile,
      resolve: (obj: UserPrisma, _: unknown, context: Context, info) => {
        const dataLoader = getProfileLoader(info, context);

        // return context.prisma.profile.findUnique({
        //   where: {
        //     userId: obj.id,
        //   },
        // });
        return dataLoader.load(obj.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(user),
      resolve: (obj: UserPrisma, _: unknown, context: Context, info) => {
        const dataLoader = getUserSubscribedToLoader(info, context);
        // return context.prisma.user.findMany({
        //   where: {
        //     subscribedToUser: {
        //       some: {
        //         subscriberId: obj.id,
        //       },
        //     },
        //   },
        // });
        return dataLoader.load(obj.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(user),
      resolve: (obj: UserPrisma, _: unknown, context: Context, info) => {
        const dataLoader = getSubscribedToUserLoader(info, context);
        // return context.prisma.user.findMany({
        //   where: {
        //     userSubscribedTo: {
        //       some: {
        //         authorId: obj.id,
        //       },
        //     },
        //   },
        // });
        return dataLoader.load(obj.id);
      },
    },
  }),
});

export const usersQuery = {
  users: {
    type: new GraphQLList(user),
    resolve: (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.user.findMany();
    },
  },
  user: {
    type: user,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: (_: unknown, args: UserPrisma, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
};
