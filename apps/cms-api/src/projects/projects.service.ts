import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import {
  OrganizationMemberRepository,
  OrganizationMember,
  UserRepository,
  ProjectRepository,
  CreateProjectInput,
  OrganizationRoleEnum,
  Prisma
} from '@repo/api';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly organizationMemberRepository: OrganizationMemberRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository
  ) { }

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
    const organizationMember: OrganizationMember | null =
      await this.organizationMemberRepository.findMembership({
        user_id: user.sub,
        organization_id: user.organizationId,
      });
    if (!organizationMember)
      throw new UnauthorizedException(
        'You are not a member of this organization',
      );
    if (organizationMember.role === OrganizationRoleEnum.Owner)
      return this.projectRepository.findAll(user.organizationId);
    return this.projectRepository.findAllAssigned(
      user.organizationId,
      organizationMember.id,
    );
  }

  findAllAssigned(user: JwtPayload) {
    return this.projectRepository.findAllAssigned(
      user.organizationId,
      user.sub,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }
  async allProjectMembers(id: string) {
    try {
      const answer = await this.projectRepository.allMembers(id);

      if (answer == null) throw new NotFoundException("It seems the Project you're searching doesn't exists on the DB.");
      const theList = answer.projectMembers;
      if (theList == undefined) throw new ConflictException("Something happened searching for the list, try again later.")
      else if (theList.length < 1) throw new ConflictException("Sorry, it looks like the List is empty.");

      return theList;
    } catch (error) {
      throw new ConflictException(error);
    }
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

  async remove(id: string, userId: string) {
    try {

      const theRole = await this.userRepository.findById(userId);
      if (theRole?.organizationMembers[0]?.role != "Owner") throw new ConflictException("Only the Owner can delete Projects. Have a nice Day!");
      const theProject = await this.projectRepository.findOneById(id, {
        categories: true,
        tags: true,
        projectMembers: true,
        testimonials: true,
      });

      if (theProject == null)
        throw new NotFoundException(
          "The Project you want to delete doesn't exists.",
        );
      const { categories, projectMembers, tags, testimonials } = theProject;


      if (categories != undefined || projectMembers != undefined || tags != undefined || testimonials != undefined) {
        const disconnect = await this.projectRepository.disconnectFromProject(id);
        const deleteTestimonial = await this.projectRepository.disconnectTestimonials(id);

        if (disconnect.categories.length > 0 && disconnect.tags.length > 0 && disconnect.projectMembers.length > 0) throw new NotAcceptableException("Something went wrong disconnecting related stuff with the actual project, try again later please.");
        else if (deleteTestimonial.testimonials.length > 0) throw new ConflictException("It seems that there are registers that don't want to be deleted yet. Try again later please.");
      }

      const answer = await this.projectRepository.delete(id);
      if (answer instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException(
        "It seems that the project didn't exist, so we can't delete it",
      );
      console.log(answer);
      return `The project with id ${answer.id} and titled ${answer.name} was successfully deleted!`;
    } catch (error: Error | any) {
      throw new ConflictException(error);
    }
  }
}
