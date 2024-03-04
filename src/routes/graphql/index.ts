import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, qraphqlShema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

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

      const errors = validate(qraphqlShema, parse(query), [depthLimit(5)]);
      if (errors.length) return { errors };

      return await graphql({
        schema: qraphqlShema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          dataLoaders: new WeakMap(),
        },
      });
    },
  });
};

export default plugin;
