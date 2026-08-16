import { Test, TestingModule } from '@nestjs/testing';
import { EmbedService } from './embed.service';

describe('EmbedService', () => {
  let service: EmbedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmbedService],
    }).compile();

    service = module.get<EmbedService>(EmbedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
