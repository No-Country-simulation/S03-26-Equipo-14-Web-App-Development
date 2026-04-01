import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import {
  CreateTestimonialDto,
  CreateTestimonialQuoteDto,
} from './dto/create-testimonial.dto';
import {
  ChangeStatusDto,
  UpdateTestimonialDto,
} from './dto/update-testimonial.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  FindAllQueryTestimonialDto,
  GetByFragmentDto,
} from './dto/get-testimonial.dto';

import { OrgRoles } from 'src/common/decorator/organization-role.decorator';
import {
  OrganizationRoleEnum,
  Testimonial,
  TestimonialStatus,
  TestimonialType,
} from '@repo/api';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post('quote')
  @Public()
  async createQuote(@Body() createTestimonialDto: CreateTestimonialQuoteDto) {
    await this.testimonialsService.creatQuote(createTestimonialDto);
  }

  @Post()
  async createTestimonial(
    @Body()
    createTestimonialDto: CreateTestimonialDto,
  ) {
    console.log('Endpoint', createTestimonialDto);
    return await this.testimonialsService.createTestimonial(
      createTestimonialDto,
    );
  }

  @Get('byFragment')
  async getByFragment(
    @Query() queryDto: GetByFragmentDto,
  ): Promise<Testimonial[]> {
    return await this.testimonialsService.searchByFragment(queryDto);
  }

  @Get("/:projectId")
  findAll(@Query() queryDto: FindAllQueryTestimonialDto, @Param('projectId') projectId: string, @GetUser() user: JwtPayload) {
    return this.testimonialsService.findAll(queryDto, projectId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(+id);
  }

  @OrgRoles(OrganizationRoleEnum.Admin, OrganizationRoleEnum.Owner)
  @Patch('changeStatus/:id')
  changeStatus(
    @Param('id') id: string,
    @Body()
    body: ChangeStatusDto,
  ) {
    return this.testimonialsService.changeStatus(id, body);
  }

  @OrgRoles(
    OrganizationRoleEnum.Admin,
    OrganizationRoleEnum.Owner,
    OrganizationRoleEnum.Editor,
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @OrgRoles(OrganizationRoleEnum.Admin, OrganizationRoleEnum.Owner)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(+id);
  }
}
