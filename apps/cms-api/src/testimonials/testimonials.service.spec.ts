import { Test, TestingModule } from '@nestjs/testing';
import { TestimonialsService } from './testimonials.service';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('TestimonialsService', () => {
  let service: TestimonialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestimonialsService],
    }).compile();

    service = module.get<TestimonialsService>(TestimonialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
