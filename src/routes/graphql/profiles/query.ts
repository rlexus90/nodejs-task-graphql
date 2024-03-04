import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { memberType, memberTypeId } from '../memberTypes/query.js';
import { Profile as ProfilePrisma } from '@prisma/client';
import { user } from '../users/query.js';
import { getMemberTypeLoader } from '../dataLoaders/memberTypeLoader.js';

export const profile = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
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
    memberType: {
      type: memberType,
      resolve: (obj: ProfilePrisma, _: unknown, context: Context, info) => {
        const dataLoader = getMemberTypeLoader(info, context);
        // return context.prisma.memberType.findUnique({
        //   where: {
        //     id: obj.memberTypeId,
        //   },
        // });
        return dataLoader.load(obj.id);
      },
    },
    user: {
      type: user,
      resolve: (obj: ProfilePrisma, _: unknown, { prisma }: Context) => {
        return prisma.user.findUnique({
          where: {
            id: obj.userId,
          },
        });
      },
    },
  }),
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
