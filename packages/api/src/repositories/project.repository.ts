import { Injectable } from '@nestjs/common';
import {
  CreateProjectInput,
  UpdateProjectInput,
} from './interfaces/project.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project } from '@workspace/database';

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

  async findOneById(id: string): Promise<Project | null> {
    return this.prisma.client.project.findUnique({
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

  async generateApiKey(key: string, projectId: string) {
    await this.prisma.client.project.update({
      where: { id: projectId },
      data: {
        api_key: key,
      },
    })
  }
}
