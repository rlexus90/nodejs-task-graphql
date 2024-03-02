import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, qraphqlShema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { prisma } = fastify;
      const { query, variables } = req.body;

      return await graphql({
        schema: qraphqlShema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
        },
      });
    },
  });
};

export default plugin;
