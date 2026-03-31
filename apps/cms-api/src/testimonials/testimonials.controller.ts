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
import { UpdateTestimonialQuoteDto } from './dto/update-testimonial.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  FindAllQueryTestimonialDto,
  GetByFragmentDto,
} from './dto/find-all-query-testimonial.dto';
import { Testimonial } from '@repo/api';

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialQuoteDto,
  ) {
    return this.testimonialsService.update(+id, updateTestimonialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(+id);
  }
}
