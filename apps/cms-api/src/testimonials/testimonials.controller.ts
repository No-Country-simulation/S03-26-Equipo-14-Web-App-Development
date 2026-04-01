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
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  FindAllQueryTestimonialDto,
  GetByFragmentDto,
} from './dto/find-all-query-testimonial.dto';
import { OrganizationRoleEnum, Testimonial } from '@repo/api';
import { OrgRoles } from 'src/common/decorator/organization-role.decorator';
import { OrganizationRole } from '@repo/api';

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
  async getByFragment(@Query() queryDto: GetByFragmentDto): Promise<Testimonial[]>  {
    return await this.testimonialsService.searchByFragment(queryDto);
  }

  @Get()
  findAll(@Query() queryDto: FindAllQueryTestimonialDto) {
    return this.testimonialsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(+id);
  }

  @OrgRoles(OrganizationRoleEnum.Admin, OrganizationRoleEnum.Owner, OrganizationRoleEnum.Editor)
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
