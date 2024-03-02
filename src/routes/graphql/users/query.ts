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

const user = new GraphQLObjectType({
  name: 'user',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
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
