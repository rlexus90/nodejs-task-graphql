import { User } from '@prisma/client';

export interface UserExtendet extends User {
  userSubscribedTo?: Subscript[];
  subscribedToUser?: Subscript[];
}

export type Subscript = {
  subscriberId: string;
  authorId: string;
};
