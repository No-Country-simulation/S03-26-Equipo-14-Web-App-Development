import { Controller, Get, UseGuards } from '@nestjs/common';
import { EmbedService } from './embed.service';
import { Public } from 'src/api/auth/decorators/public.decorator';
import { EmbedApiKeyGuard } from './guards/embed-api-key.guard';
import { EmbedCredentials } from './decorators/embed-credentials.decorator';

@Controller('embed')
export class EmbedController {
  constructor(private readonly embedService: EmbedService) {}

  @Public()
  @UseGuards(EmbedApiKeyGuard)
  @Get()
  getTestimonials(
    @EmbedCredentials() credentials: { projectId: string; orgId: string },
  ) {
    return credentials;
  }
}
