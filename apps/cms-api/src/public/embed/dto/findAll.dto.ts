import { IsUUID } from 'class-validator';
import { IsRequiredString } from 'src/api/common/decorator/common';

export class FindAllDto {
  @IsRequiredString()
  @IsUUID()
  projectId!: string;
  @IsRequiredString()
  @IsUUID()
  orgId!: string;
}
