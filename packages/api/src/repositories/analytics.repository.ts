import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { TestimonialRepository } from "./testimonial.repository";
import { Decimal } from "@workspace/database";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class AnalyticsRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly testimonialRepository: TestimonialRepository,
        private readonly projectRepository: ProjectRepository
    ) { }

    async getProjectCalification(projectId: string): Promise<{ rating: Decimal | null }> {
        const { _avg } = await this.prisma.client.testimonial.aggregate({
            where: {
                project_id: projectId,
            },
            _avg: {
                rating: true,
            },
        })

        return _avg
    }

    async counterProjects(organization_id: string) {
        return await this.projectRepository.findAll(organization_id);
    }

    async countTestimonials(id: string, type?: string) {
        if (type == "perProject") {
            const answer = await this.prisma.client.project.findUnique({
                where: {
                    id
                },
                select: {
                    _count: {
                        select: {
                            testimonials: true,
                        }
                    }
                }
            });
            return answer;

        }
    }
}