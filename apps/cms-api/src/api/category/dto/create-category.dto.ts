import { IsString, IsTaxId } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name!: string;
}
