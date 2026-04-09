import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    name!: string;
}

export class searchTagDto {
    
    name!: string[]
}
