import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { TestimonialType } from "../../../../../packages/database/dist";

export class FindAllQueryTestimonialDto {
    @IsOptional()
    @IsString()
    @IsUUID()
    category_id?: string;

    @IsOptional()
    @IsString()
    @IsEnum(TestimonialType)
    type?: TestimonialType;
}