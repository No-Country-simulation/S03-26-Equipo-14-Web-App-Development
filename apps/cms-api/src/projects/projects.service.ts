import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import {
  OrganizationMemberRepository,
  OrganizationMember,
  ProjectRepository,
  CreateProjectInput,
  OrganizationRoleEnum,
} from '@repo/api';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly organizationMemberRepository: OrganizationMemberRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  private async VerifyOwnerCredentials(user: JwtPayload) {
    const organizationMember: OrganizationMember | null =
      await this.organizationMemberRepository.findMembership({
        user_id: user.sub,
        organization_id: user.organizationId,
      });
    if (!organizationMember)
      throw new UnauthorizedException(
        'You are not a member of this organization',
      );
    if (organizationMember.role !== 'Owner')
      throw new UnauthorizedException(
        'You are not allowed to create a project',
      );
  }

  async create(
    createProjectDto: CreateProjectDto,
    user: JwtPayload,
  ): Promise<any> {
    await this.VerifyOwnerCredentials(user);

    const data: CreateProjectInput = {
      ...createProjectDto,
      organization_id: user.organizationId,
    };

    const project = await this.projectRepository.create({ data });
    return { message: 'Project created successfully', project };
  }

  async findAll(user: JwtPayload) {    
    
    const organizationMember: OrganizationMember | null = await this.organizationMemberRepository.findMembership({
      user_id: user.sub,
      organization_id: user.organizationId,
    })
    if (!organizationMember) throw new UnauthorizedException('You are not a member of this organization');
    if(organizationMember.role === OrganizationRoleEnum.Owner) return this.projectRepository.findAll(user.organizationId);
    return this.projectRepository.findAllAssigned(user.organizationId, organizationMember.id);
  
  }

  findAllAssigned(user: JwtPayload) {
    return this.projectRepository.findAllAssigned(user.organizationId, user.sub);
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: JwtPayload,
  ) {
    await this.VerifyOwnerCredentials(user);
    try {
      await this.projectRepository.update({ id, ...updateProjectDto });
      return { message: 'Project successfully updated' };
    } catch (error) {
      throw new ConflictException('Error updating');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
