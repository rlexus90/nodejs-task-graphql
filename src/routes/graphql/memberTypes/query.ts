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

export const memberTypeId = new GraphQLNonNull(
  new GraphQLEnumType({
    name: 'memberTypeId',
    values: {
      basic: { value: MemberTypeId.BASIC },
      business: { value: MemberTypeId.BUSINESS },
    },
  }),
);

const memberType = new GraphQLObjectType({
  name: 'memberType',
  fields: {
    id: {
      type: memberTypeId,
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

export const memberTypesQuery = {
  memberTypes: {
    type: new GraphQLList(memberType),
    resolve: (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.memberType.findMany();
    },
  },
};
