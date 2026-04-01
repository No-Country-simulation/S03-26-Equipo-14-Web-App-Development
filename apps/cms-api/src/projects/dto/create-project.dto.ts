import { IsString } from 'class-validator';
import { IsRequiredString } from 'src/common/decorator/common';

export class CreateProjectDto {
  @IsRequiredString()
  name!: string;

  @IsString()
  description?: string;
}
