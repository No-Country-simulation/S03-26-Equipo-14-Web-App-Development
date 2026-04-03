import { Injectable } from '@nestjs/common';
import {
  CreateProjectInput,
  projectInclude,
  UpdateProjectInput,
} from './interfaces/project.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@workspace/database';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create({ data }: { data: CreateProjectInput }) {
    return this.prisma.client.project.create({
      data: {
        ...data,
      },
    });
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

  async findOneById(id: string, include?: projectInclude): Promise<Project | null> {
    if(include){
      return await this.prisma.client.project.findUnique({
        where: {id},
        include
      })
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

  async update(project: UpdateProjectInput) {
    await this.prisma.client.project.update({
      where: { id: project.id },
      data: {
        ...project,
      },
    });
  }

  async delete(id: string){
    return this.prisma.client.project.delete({
      where: {
        id
      }
    })
  }
}
