import { IsEmail, IsString } from 'class-validator';

export class CreateRegisterOwnerDto {
  @IsEmail()
  email!: string;
  @IsString()
  password!: string;
  @IsString()
  name!: string;
  @IsString()
  organizationName!: string;
  @IsString()
  organizationDescription!: string;
}

export interface CreateRegisterOwnerInput {
  email: string;
  password: string;
  name: string;
  organizationName: string;
  organizationDescription: string;
}
export class CreateRegisterMemberDto {
  @IsEmail()
  email!: string;
  @IsString()
  name!: string;
  @IsString()
  role!: string;
  @IsString()
  organizationId!: string;
  @IsString()
  projectId!: string;
}

export interface CreateRegisterMemberInput {
  email: string;
  name: string;
  role: string;
  organizationId: string;
  projectId: string;
}
