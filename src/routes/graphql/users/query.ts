import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLResolveInfo,
} from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { User as UserPrisma } from '@prisma/client';
import { post } from '../posts/query.js';
import { profile } from '../profiles/query.js';
import { getPostsLoader } from '../dataLoaders/postsLoader.js';
import { getProfileLoader } from '../dataLoaders/profileLoader.js';

import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { Subscript, UserExtendet } from '../types/users.js';
import { getSubscribedToUserLoader } from '../dataLoaders/subscribedToUserLoader.js';
import { getUserSubscribedToLoader } from '../dataLoaders/userSubscribedToLoader.js';

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
      resolve: (obj: UserExtendet, _: unknown, context: Context, info) => {
        const dataLoader = getUserSubscribedToLoader(info, context);

        const { userSubscribedTo } = obj;
        if (userSubscribedTo) {
          if (!userSubscribedTo.some((el) => el.authorId)) return userSubscribedTo;
        }
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
      resolve: (obj: UserExtendet, _: unknown, context: Context, info) => {
        const dataLoader = getSubscribedToUserLoader(info, context);

        const { subscribedToUser } = obj;
        if (subscribedToUser) {
          if (!subscribedToUser.some((el) => el.authorId)) return subscribedToUser;
        }
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
    resolve: async (
      _: unknown,
      __: unknown,
      context: Context,
      info: GraphQLResolveInfo,
    ) => {
      // return context.prisma.user.findMany();

      const resolveInfo = parseResolveInfo(info) as ResolveTree;
      const { fields } = simplifyParsedResolveInfoFragmentWithType(resolveInfo, user);
      const userSubscribedTo = Object.keys(fields).includes('userSubscribedTo');
      const subscribedToUser = Object.keys(fields).includes('subscribedToUser');

      const users = await context.prisma.user.findMany({
        include: {
          userSubscribedTo,
          subscribedToUser,
        },
      });

      const usersCache = new Map<string, UserExtendet>(
        users.map((user) => [user.id, user]),
      );

      users.forEach((user) => {
        if (userSubscribedTo) {
          user.userSubscribedTo = (user.userSubscribedTo.map((user) =>
            usersCache.get(user.subscriberId),
          ) || []) as unknown as Subscript[];
        }
        if (subscribedToUser) {
          user.subscribedToUser = (user.subscribedToUser.map((user) =>
            usersCache.get(user.authorId),
          ) || []) as unknown as Subscript[];
        }
      });

      return users;
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
