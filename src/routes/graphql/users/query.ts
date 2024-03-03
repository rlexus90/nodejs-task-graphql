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
      resolve: (obj: UserPrisma, _: unknown, { prisma }: Context) => {
        return prisma.post.findMany({
          where: {
            authorId: obj.id,
          },
        });
      },
    },
    profile: {
      type: profile,
      resolve: (obj: UserPrisma, _: unknown, { prisma }: Context) => {
        return prisma.profile.findUnique({
          where: {
            userId: obj.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(user),
      resolve: (obj: UserPrisma, _: unknown, { prisma }: Context) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: obj.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(user),
      resolve: (obj: UserPrisma, _: unknown, { prisma }: Context) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: obj.id,
              },
            },
          },
        });
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
