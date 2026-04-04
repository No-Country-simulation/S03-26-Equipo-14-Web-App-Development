import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { TestimonialRepository } from "./testimonial.repository";
import { Decimal } from "@workspace/database";

@Injectable()
export class AnalyticsRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly testimonialRepository: TestimonialRepository,
    ){}

    async getProjectCalification(projectId: string): Promise<{rating: Decimal | null}> {
        const {_avg} =  await this.prisma.client.testimonial.aggregate({
            where: {
                project_id: projectId,
            },
            _avg: {
                rating: true,
            },
        })

        return _avg 
    }
}