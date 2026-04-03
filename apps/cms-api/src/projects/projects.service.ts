import { Prisma } from '../../../../packages/database/dist';
import {
  ConflictException,
  Injectable,
  NotFoundException,
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

  findAll(user: JwtPayload) {
    if (user.role === OrganizationRoleEnum.Owner)
      return this.projectRepository.findAll(user.organizationId);
    throw new UnauthorizedException('You are not allowed to view all projects');
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

  async remove(id: string) {
    try {

      const theProject = await this.projectRepository.findOneById(id, {categories: true, tags: true, projectMembers: true, testimonials: true});

      if(theProject == null) throw new NotFoundException("The Project you want to delete doesn't exists.");

      const categories = await theProject?.categories
      const answer = await this.projectRepository.delete(id); 


      if(answer instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException("It seems that the project didn't exist, so we can't delete it");
 
      return `The project with id ${answer.id} and titled ${answer.name} was successfully deleted!`;
    } catch (error: Error | any) {
      throw new ConflictException(error)
    }
  }
}
