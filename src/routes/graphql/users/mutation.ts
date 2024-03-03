import {
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { user } from './query.js';
import { User as UserPrisma } from '@prisma/client';

type createArgs = { dto: Omit<UserPrisma, 'id'> };
type changeArgs = {
  id: string;
  dto: Omit<UserPrisma, 'id'>;
};
type delArgs = { id: string };
type subscribeArgs = { userId: string; authorId: string };

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const createUser: GraphQLFieldConfig<void, Context, createArgs> = {
  type: user,
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInput) },
  },
  resolve: (_, args, { prisma }) => {
    return prisma.user.create({
      data: args.dto,
    });
  },
};

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    balance: { type: GraphQLFloat },
  }),
});

export const changeUser: GraphQLFieldConfig<void, Context, changeArgs> = {
  type: user,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: (_, args, { prisma }) => {
    return prisma.user.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

export const deleteUser: GraphQLFieldConfig<void, Context, delArgs> = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, args, { prisma }) => {
    await prisma.user.delete({
      where: {
        id: args.id,
      },
    });
    return true;
  },
};

export const subscribeTo: GraphQLFieldConfig<void, Context, subscribeArgs> = {
  type: user,
  args: {
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, args, { prisma }) => {
    return prisma.user.update({
      where: {
        id: args.userId,
      },
      data: {
        userSubscribedTo: {
          create: {
            authorId: args.authorId,
          },
        },
      },
    });
  },
};

export const unsubscribeFrom: GraphQLFieldConfig<void, Context, subscribeArgs> = {
  type: GraphQLBoolean,
  args: {
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, args, { prisma }) => {
    await prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: args.userId,
          authorId: args.authorId,
        },
      },
    });
    return true;
  },
};

export const userMutations = {
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
};
