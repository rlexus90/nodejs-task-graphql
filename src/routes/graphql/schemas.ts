import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypesQuery } from './memberTypes/query.js';
import { postsQuery } from './posts/query.js';
import { usersQuery } from './users/query.js';
import { profileQuery } from './profiles/query.js';
import { postMutations } from './posts/mutation.js';
import { profileMutations } from './profiles/mutation.js';
import { userMutations } from './users/mutation.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const qraphqlShema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: () => ({
      ...memberTypesQuery,
      ...postsQuery,
      ...usersQuery,
      ...profileQuery,
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({ ...postMutations, ...profileMutations, ...userMutations }),
  }),
});
