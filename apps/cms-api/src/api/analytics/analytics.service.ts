import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AnalyticsRepository, Decimal, OrganizationMemberRepository, ProjectRepository } from '@repo/api';
import { JwtPayload } from 'src/api/auth/types/jwt-payload.type';

@Injectable()
export class AnalyticsService {

    constructor(
        private readonly analyticsRepository: AnalyticsRepository,
        private readonly projectRepository: ProjectRepository,
    ) { }

    async counterTestimonials(id: string){
        try {
            const answer = await this.analyticsRepository.countTestimonials(id, 'perProject');

            if(answer == null) throw new NotFoundException("It looks like there are not Testimonials attached to this project.");

            return { testimonials: answer._count.testimonials}
            
        } catch (error) {
            throw new ConflictException(error)
        }
    }
    async counterProjects(orgId: string) {
        try {
            const answer = await this.analyticsRepository.counterProjects(orgId);

            if (answer.length < 1) throw new NotFoundException("There wasn't any Project related to the organization.");

            const count = answer.length;

            return { projects: count };
        } catch (error) {
            throw new ConflictException(error)
        }
    }
    async getProjectCalification(projectId: string, user: JwtPayload): Promise<{ rating: Decimal | null }> {
        const project = await this.projectRepository.findOneById(projectId);
        if (!project) throw new NotFoundException('Project not found');
        if (project.organization_id !== user.organizationId) throw new NotFoundException('Project not found');
        return await this.analyticsRepository.getProjectCalification(projectId);
    }

}
