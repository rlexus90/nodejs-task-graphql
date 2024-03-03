import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLEnumType,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { Context } from '../types/context.js';
import { MemberType as MemberTypePrisma } from '@prisma/client';

export const memberTypeId = new GraphQLNonNull(
  new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
      basic: { value: MemberTypeId.BASIC },
      business: { value: MemberTypeId.BUSINESS },
    },
  }),
);

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: memberTypeId,
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const memberTypesQuery = {
  memberTypes: {
    type: new GraphQLList(memberType),
    resolve: (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.memberType.findMany();
    },
  },

  memberType: {
    type: memberType,
    args: {
      id: {
        type: memberTypeId,
      },
    },
    resolve: (_: unknown, args: MemberTypePrisma, { prisma }: Context) => {
      return prisma.memberType.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
};
