import { Test, TestingModule } from '@nestjs/testing';
import { EmbedController } from './embed.controller';
import { EmbedService } from './embed.service';

describe('EmbedController', () => {
  let controller: EmbedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmbedController],
      providers: [EmbedService],
    }).compile();

    controller = module.get<EmbedController>(EmbedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
