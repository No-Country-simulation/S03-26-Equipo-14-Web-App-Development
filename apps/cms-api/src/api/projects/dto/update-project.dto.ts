import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  name!: string;
  description!: string;
}
export interface addMember2Project{
  projectId: string;
  orgMemberId: string;
}