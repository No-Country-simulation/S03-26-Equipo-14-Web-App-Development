import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationMemberRepository, OrganizationRole, TestimonialRepository } from '@repo/api';
import test from 'node:test';

@Injectable()
export class OrgRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,       
        private readonly testimonialRepository: TestimonialRepository,
        private readonly organizationMemberRepository: OrganizationMemberRepository
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles =
        this.reflector.getAllAndOverride<OrganizationRole[]>(
            'org_roles',
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) throw new ForbiddenException('No authenticated user');

        const testimonialId = request.params.id;

        if (!testimonialId)
        throw new ForbiddenException('Missing testimonial id');
        const testimonial = await this.testimonialRepository.findByIdSelectOrganizationId(testimonialId);
    
        if (!testimonial)
        throw new ForbiddenException('Testimonial not found');

        
        if(testimonial.project.organization_id !== user.organizationId) throw new ForbiddenException('Testimonial does not belong to user organization');

        const membership =
        await this.organizationMemberRepository.findMembership({
            user_id: user.id,
            organization_id: testimonial.project.organization_id,
        })

        if (!membership)
        throw new ForbiddenException('User not in organization');

        if (!requiredRoles.includes(membership.role))
        throw new ForbiddenException('Insufficient role');

        return true;
    }   
}