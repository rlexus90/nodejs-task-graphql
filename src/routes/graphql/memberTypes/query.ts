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

const memberTypes = new GraphQLObjectType({
  name: 'memberTypes',
  fields: {
    id: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: 'memberType',
          values: {
            basic: { value: MemberTypeId.BASIC },
            business: { value: MemberTypeId.BUSINESS },
          },
        }),
      ),
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

export const memberTypesQuery = {
  memberTypes: {
    type: new GraphQLList(memberTypes),
    resolve: (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.memberType.findMany();
    },
  },
};
