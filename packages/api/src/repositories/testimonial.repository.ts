import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Testimonial } from '@workspace/database';
import { FindAllTestimonialsQuery } from './interfaces';

@Injectable()
export class TestimonialRepository {
  constructor(private readonly prisma: PrismaService) {}

  //addd Methods, get, delete, update

  async findAll(query: FindAllTestimonialsQuery): Promise<Testimonial[]> {
    return this.prisma.client.testimonial.findMany({
      where : {
        ...query
      }
    })
  }

}
