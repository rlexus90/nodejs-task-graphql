import {
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { profile } from './query.js';
import { Profile as ProfilePrisma } from '@prisma/client';
import { memberTypeId } from '../memberTypes/query.js';

type createArgs = { dto: Omit<ProfilePrisma, 'id'> };
type changeArgs = {
  id: string;
  dto: Omit<ProfilePrisma, 'id' | 'userId'>;
};
type delArgs = { id: string };

const createProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: { type: memberTypeId },
  }),
});

export const createProfile: GraphQLFieldConfig<void, Context, createArgs> = {
  type: profile,
  args: {
    dto: { type: new GraphQLNonNull(createProfileInput) },
  },
  resolve: (_, args, { prisma }) => {
    return prisma.profile.create({
      data: args.dto,
    });
  },
};

const changeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberTypeId },
  }),
});

export const changeProfile: GraphQLFieldConfig<void, Context, changeArgs> = {
  type: profile,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    dto: { type: new GraphQLNonNull(changeProfileInput) },
  },
  resolve: (_, args, { prisma }) => {
    return prisma.profile.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

export const deleteProfile: GraphQLFieldConfig<void, Context, delArgs> = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, args, { prisma }) => {
    await prisma.profile.delete({
      where: {
        id: args.id,
      },
    });
    return true;
  },
};

export const profileMutations = { createProfile, changeProfile, deleteProfile };
