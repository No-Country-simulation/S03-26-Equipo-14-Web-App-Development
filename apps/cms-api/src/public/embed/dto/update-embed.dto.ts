import { PartialType } from '@nestjs/swagger';
import { CreateEmbedDto } from './create-embed.dto';

export class UpdateEmbedDto extends PartialType(CreateEmbedDto) {}
