import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { OrgRoles } from 'src/common/decorator/organization-role.decorator';
import { OrganizationRoleEnum } from '@repo/api';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  findAll(@GetUser() user: JwtPayload) {
    return this.projectsService.findAll(user);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: JwtPayload,
  ) {
    this.projectsService.update(id, updateProjectDto, user);
  } 
  
  @Delete(':id')
<<<<<<< HEAD
  remove(@Param('id') id: string, @Body() userId: string) {
    return this.projectsService.remove(id, userId);
=======
  remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.projectsService.remove(id, user.sub);
>>>>>>> 044e9e18ca6738b9b106ff7ec4c3927300e7ad6a
  }
}
