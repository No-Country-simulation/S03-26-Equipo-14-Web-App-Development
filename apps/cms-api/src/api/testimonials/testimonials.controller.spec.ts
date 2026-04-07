import { Test, TestingModule } from '@nestjs/testing';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('TestimonialsController', () => {
  let controller: TestimonialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestimonialsController],
      providers: [TestimonialsService],
    }).compile();

    controller = module.get<TestimonialsController>(TestimonialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
