import { Prisma } from '@workspace/database';

export type UserWithOrgs = Prisma.UserGetPayload<{
  include: {
    organizationMembers: {
      include: {
        organization: true;
      };
    };
  };
}>;
