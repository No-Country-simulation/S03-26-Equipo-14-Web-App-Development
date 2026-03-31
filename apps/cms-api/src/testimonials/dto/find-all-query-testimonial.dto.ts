import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class FindAllQueryTestimonialDto {
    @IsOptional()
    @IsString()
    @IsUUID()
    category_id?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    sorted?: string;
}