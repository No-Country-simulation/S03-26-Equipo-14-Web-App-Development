import { Injectable, NotFoundException } from '@nestjs/common';
import { AnalyticsRepository, Decimal, OrganizationMemberRepository, ProjectRepository } from '@repo/api';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class AnalyticsService {

    constructor(
        private readonly analyticsRepository: AnalyticsRepository,        
        private readonly projectRepository: ProjectRepository,
    ) {}

    async getProjectCalification(projectId: string, user: JwtPayload): Promise<{rating : Decimal | null}> {
        const project = await this.projectRepository.findOneById(projectId);
        if(!project) throw new NotFoundException('Project not found');
        if(project.organization_id !== user.organizationId) throw new NotFoundException('Project not found');
        return await this.analyticsRepository.getProjectCalification(projectId);
    }

}
