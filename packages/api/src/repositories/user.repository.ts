import { Injectable } from '@nestjs/common';
import { Organization_Role } from '@workspace/database';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@workspace/database';
import { CreateMemberInput, CreateOwnerInput } from './interfaces';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find() {
    return (await this.prisma.client.user.findMany()) as User[];
  }

  // update UserRole. update user, tranfer user to other project. example of methods.

  async findByEmail(email: string) {    
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

  async createMember(data: CreateMemberInput) {
    return await this.prisma.client.$transaction(async (tx) => {
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
        },
      });
    });
  }

  async createOwner(data: CreateOwnerInput): Promise<void> {
    return await this.prisma.client.$transaction(async (tx) => {
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
          description: 'defualt project',
          api_key: 'xa@swD',
          organization_id: org.id,
        },
      });

      const projectMember = await tx.project_Member.create({
        data: {
          organization_member_id: orgMember.id,
          project_id: project.id,
        },
      });
    });
  }

  async setResetToken({userId, resetToken, resetTokenExpires} : { userId: string, resetToken: string, resetTokenExpires: Date}) : Promise<void>{
    
    await this.prisma.client.user.update({
      where: {
        id: userId
      },
      data: {
        resetToken,
        resetTokenExpires
      }
    })
  }

}
