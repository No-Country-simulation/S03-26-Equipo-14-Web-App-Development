import { Injectable } from '@nestjs/common';
import { Organization_Role, Prisma } from '@workspace/database';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@workspace/database';
import {
  CreateMemberInput,
  CreateOwnerInput,
  UpdateProfileInput,
} from './interfaces/user.interface';

type UserWithOrganization = Prisma.UserGetPayload<{
  include: {
    organizationMembers: {
      include: {
        organization: true;
      };
    };
  };
}>;

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find() {
    return (await this.prisma.client.user.findMany()) as User[];
  }

  // update UserRole. update user, tranfer user to other project. example of methods.

  async findByEmail(email: string): Promise<UserWithOrganization | null> {
    return await this.prisma.client.user.findUnique({
      where: {
        email,
      },
      include: {
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });
  }

  async changePassword(newPassword: string, userId: string) {
    return await this.prisma.client.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      },
    });
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    return await this.prisma.client.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findById(userId: string, includeOrganzatonMembers?: boolean) {
    const include = includeOrganzatonMembers
      ? {
          organizationMembers: {
            include: {
              organization: true,
            },
          },
        }
      : {};

    return await this.prisma.client.user.findUnique({
      where: {
        id: userId,
      },
      include,
    });
  }
  async createMember(data: CreateMemberInput) {
    return await this.prisma.client.$transaction(async (tx) => {
      console.log(data.email);
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: data.generatePassword,
          name: data.name,
        },
      });

      const orgMember = await tx.organization_Member.create({
        data: {
          organization_id: data.organizationId,
          role: data.role as Organization_Role,
          user_id: user.id,
        },
      });

      await tx.project_Member.create({
        data: {
          organization_member_id: orgMember.id,
          project_id: data.projectId,
          user_id: user.id,
        },
      });
    });
  }

  async createOwner(data: CreateOwnerInput): Promise<void> {
    const defaultCategories = [
      {
        name: 'product',
      },
      {
        name: 'event',
      },
      {
        name: 'client',
      },
      {
        name: 'industry',
      },
    ];
    return await this.prisma.client.$transaction(
      async (tx) => {
        const user = await tx.user.create({
          data: {
            email: data.email,
            password: data.hashPassword,
            name: data.name,
          },
        });

        const org = await tx.organization.create({
          data: {
            name: data.organizationName,
            description: data.organizationDescription,
            user_id: user.id,
          },
        });

        const orgMember = await tx.organization_Member.create({
          data: {
            user_id: user.id,
            organization_id: org.id,
            role: 'Owner',
          },
        });

        const project = await tx.project.create({
          data: {
            name: 'default',
            description: 'default project',
            api_key: 'xa@swD',
            organization_id: org.id,
          },
        });

        await tx.project_Member.create({
          data: {
            organization_member_id: orgMember.id,
            project_id: project.id,
            user_id: user.id,
          },
        });

        await tx.category.createMany({
          data: defaultCategories.map((category) => ({
            name: category.name,
            project_id: project.id,
          })),
        });
      },
      { timeout: 15000 },
    );
  }

  async setResetToken({
    userId,
    resetToken,
    resetTokenExpires,
  }: {
    userId: string;
    resetToken: string;
    resetTokenExpires: Date;
  }): Promise<void> {
    await this.prisma.client.user.update({
      where: {
        id: userId,
      },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });
  }

  async deleteResetToken({ userId }: { userId: string }): Promise<void> {
    await this.prisma.client.user.update({
      where: {
        id: userId,
      },
      data: {
        resetToken: null,
        resetTokenExpires: null,
      },
    });
  }

  async delete(userId: string) {
    await this.prisma.client.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
