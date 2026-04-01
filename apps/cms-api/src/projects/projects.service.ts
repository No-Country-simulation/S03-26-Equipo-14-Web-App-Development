import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { OrganizationMemberRepository, OrganizationMember, ProjectRepository, CreateProjectInput } from '@repo/api';


@Injectable()
export class ProjectsService {

  constructor(
    private readonly organizationMemberRepository: OrganizationMemberRepository,
    private readonly projectRepository: ProjectRepository
  ) {}


  async create(createProjectDto: CreateProjectDto, user: JwtPayload) : Promise<any>{
    const organizationMember: OrganizationMember | null = await this.organizationMemberRepository.findMembership({user_id: user.sub, organization_id: user.organizationId});
    if(!organizationMember) throw new UnauthorizedException('You are not a member of this organization');
    if(organizationMember.role !== 'Owner') throw new UnauthorizedException('You are not allowed to create a project');    

    const data : CreateProjectInput= {
      ... createProjectDto,
      organization_id: user.organizationId
    }

    const project = await this.projectRepository.create({data});
    return {message: 'Project created successfully', project};
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
