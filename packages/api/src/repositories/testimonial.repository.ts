import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestimonialRepository {
  constructor(private readonly prisma: PrismaService) {}

  //addd Methods, get, delete, update
}
