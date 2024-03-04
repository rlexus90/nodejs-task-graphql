import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLBoolean,
} from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { post } from './query.js';
import { Post as PostsPrisma } from '@prisma/client';

type createArgs = { dto: Omit<PostsPrisma, 'id'> };
type changeArgs = {
  id: string;
  dto: Omit<PostsPrisma, 'id' | 'authorId'>;
};
type delArgs = { id: string };

const createPostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  }),
});

export const createPost: GraphQLFieldConfig<void, Context, createArgs> = {
  type: post,
  args: {
    dto: { type: new GraphQLNonNull(createPostInput) },
  },
  resolve: (_, args, { prisma }) => {
    return prisma.post.create({
      data: args.dto,
    });
  },
};

const changePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: { type: GraphQLString },
  }),
});

export const changePost: GraphQLFieldConfig<void, Context, changeArgs> = {
  type: post,
  args: {
    dto: { type: new GraphQLNonNull(changePostInput) },
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, args, { prisma }) => {
    return prisma.post.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

export const deletePost: GraphQLFieldConfig<void, Context, delArgs> = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, args, { prisma }) => {
    await prisma.post.delete({
      where: {
        id: args.id,
      },
    });
    return true;
  },
};

export const postMutations = { createPost, changePost, deletePost };
