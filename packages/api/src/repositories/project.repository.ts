import { Injectable } from '@nestjs/common';
import {
  CreateProjectInput,
  Project2,
  projectInclude,
  UpdateProjectInput,
} from './interfaces/project.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma as _Prisma, Project } from '@workspace/database';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateProjectInput) {
    const project = await this.prisma.client.project.create({
      data: {
        name: data.name,
        organization_id: data.organization_id,
        description: data.description,
      },
    });
    const orgMember = await this.prisma.client.organization_Member.findFirst({
      where: {
        user_id: data.sub,
      },
    });
    if (orgMember != null) {
      await this.prisma.client.project_Member.create({
        data: {
          organization_member_id: orgMember.id,
          project_id: project.id,
          user_id: data.sub,
        },
      });
      return project;
    }
  }

  async findAllAssigned(
    organizationId: string,
    orgMemberId: string,
  ): Promise<Project[]> {
    return this.prisma.client.project.findMany({
      where: {
        organization_id: organizationId,
        projectMembers: {
          some: {
            organization_member_id: orgMemberId,
          },
        },
      },
    });
  }

  async findOneById(
    id: string,
    include?: projectInclude,
  ): Promise<Project2 | null> {
    if (include) {
      const f = await this.prisma.client.project.findUnique({
        where: { id },
        include,
      });
      return f;
    }
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

  async allMembers(id: string): Promise<any[]> {
    return await this.prisma.client.project_Member.findMany({
      where: {
        project_id: id,
      },
      include: {
        organization_member: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
  async update(project: UpdateProjectInput) {
    await this.prisma.client.project.update({
      where: { id: project.id },
      data: {
        ...project,
      },
    });
  }

  async disconnectFromProject(_projectId: string) {
    return { categories: [], projectMembers: [], tags: [] };
  }

  async disconnectTestimonials(_projectId: string) {
    return { testimonials: [] };
  }

  async delete(id: string) {
    // 1. Null out member_id (FK to Project_Member, no cascade)
    await this.prisma.client.testimonial.updateMany({
      where: { project_id: id, member_id: { not: null } },
      data: { member_id: null },
    });

    // 2. Delete Testimonial_Tag rows (no cascade from Testimonial)
    await this.prisma.client.testimonial_Tag.deleteMany({
      where: { testimonial: { project_id: id } },
    });

    // 3. Delete Testimonials (no cascade from Project)
    await this.prisma.client.testimonial.deleteMany({
      where: { project_id: id },
    });

    // 4. Delete Project — Category, Project_Member and _ProjectToTag cascade automatically
    return this.prisma.client.project.delete({ where: { id } });
  }

  async generateApiKey(key: string, projectId: string) {
    await this.prisma.client.project.update({
      where: { id: projectId },
      data: {
        api_key: key,
      },
    });
  }

  async getProjectsbyMember(memberId: string){
    return this.prisma.client.project.findMany({
      where: {
        projectMembers: {
          some: {
            organization_member_id: memberId
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true
      }
    })
  }
}
