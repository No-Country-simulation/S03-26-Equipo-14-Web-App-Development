import { IsUUID } from 'class-validator';

export class ParamsDto {
  @IsUUID()
  id!: string;
  @IsUUID()
  projectId!: string;
}
