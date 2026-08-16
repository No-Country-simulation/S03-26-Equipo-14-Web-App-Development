import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
