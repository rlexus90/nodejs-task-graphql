import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { memberTypeId } from '../memberTypes/query.js';
import { Profile as ProfilePrisma } from '@prisma/client';

const profile = new GraphQLObjectType({
  name: 'profile',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: { type: memberTypeId },
  },
});

export const profileQuery = {
  profiles: {
    type: new GraphQLList(profile),
    resolve: (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.profile.findMany();
    },
  },

  profile: {
    type: profile,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: (_: unknown, args: ProfilePrisma, { prisma }: Context) => {
      return prisma.profile.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
};
