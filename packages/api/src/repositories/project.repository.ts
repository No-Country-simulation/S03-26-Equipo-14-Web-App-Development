import { Injectable } from '@nestjs/common';
import {
  CreateProjectInput,
  Project2,
  projectInclude,
  UpdateProjectInput,
} from './interfaces/project.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project } from '@workspace/database';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreateProjectInput) {

    const project = await this.prisma.client.project.create({
      data: {
        name: data.name,
        organization_id: data.organization_id,
        description: data.description
      },
    });
    const orgMember = await this.prisma.client.organization_Member.findFirst({
      where: {
        user_id: data.sub
      }
    })
    if (orgMember != null) {
       await this.prisma.client.project_Member.create({
        data: {
          organization_member_id: orgMember.id,
          project_id: project.id,
          user_id: data.sub
        }
      })
      return project;
    }

  }

  async findAllAssigned(organizationId: string, orgMemberId: string): Promise<Project[]> {
    return this.prisma.client.project.findMany({
      where: {
        organization_id: organizationId,
        projectMembers: {
          some: {
            organization_member_id: orgMemberId
          }
        }
      },
    })
  }

  async findOneById(id: string, include?: projectInclude): Promise<Project2 | null> {
    if (include) {
      const f = await this.prisma.client.project.findUnique({
        where: { id },
        include
      })
      return f;
    };
    return await this.prisma.client.project.findUnique({
      where: { id },
    });
  }

  async findAll(organizationId: string): Promise<Project[]> {
    return this.prisma.client.project.findMany({
      where: {
        organization_id: organizationId,
      },
    });
  }

  async allMembers(id: string): Promise<Project2 | null> {
    return await this.prisma.client.project.findUnique({
      where: { id },
      include: {
        projectMembers: true
      }
    })
  }
  async update(project: UpdateProjectInput) {
    await this.prisma.client.project.update({
      where: { id: project.id },
      data: {
        ...project,
      },
    });
  }

  async disconnectFromProject(projectId: string) {
    return await this.prisma.client.project.update({
      where: { id: projectId },
      data: {
        categories: {
          set: []
        },
        tags: {
          set: []
        },
        projectMembers: {
          set: []
        }
      },
      include: {
        tags: true,
        categories: true,
        projectMembers: true,
      }
    })
  }

  async disconnectTestimonials(projectId: string) {
    return this.prisma.client.project.update({
      where: { id: projectId },
      data: {
        testimonials: {
          deleteMany: {},
        },
      },
      include: { testimonials: true, }
    });
  };

  async delete(id: string) {
    return this.prisma.client.project.delete({
      where: {
        id
      }, include:
      {
        tags: true,
        categories: true,
        projectMembers: true,
        testimonials: true,
      }
    })
  }

  async generateApiKey(key: string, projectId: string) {
    await this.prisma.client.project.update({
      where: { id: projectId },
      data: {
        api_key: key,
      },
    })
  }
}
