import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmbedService } from './embed.service';
import { Public } from 'src/api/auth/decorators/public.decorator';
import { EmbedApiKeyGuard } from './guards/embed-api-key.guard';
import { EmbedCredentials } from './decorators/embed-credentials.decorator';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TestimonialType } from '@repo/api';

@Controller('embed')
export class EmbedController {
  constructor(private readonly embedService: EmbedService) {}

  @Public()
  @UseGuards(EmbedApiKeyGuard)
  @Get()
  @ApiOperation({ summary: 'Endpoint with specific header' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Type for filter data',
    enum: TestimonialType,
  })
  @ApiHeader({
    name: 'x-embed-key',
    description: 'ApiKey required',
    required: true,
    schema: {
      type: 'string',
      default: 'Example cms:api:key',
    },
  })
  getTestimonials(
    @EmbedCredentials() credentials: { projectId: string; orgId: string },
    @Query(
      'type',
      new ParseEnumPipe(TestimonialType, {
        optional: true,
      }),
    )
    type?: TestimonialType,
  ) {
    const validType = type !== undefined ? type : '';
    return this.embedService.getPublishedTestimonials(validType, credentials);
  }
}
