import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma  } from '@workspace/database';
import {Testimonial} from '@workspace/database';
import { FindAllTestimonialsQuery } from './interfaces';
import {
  CreateQuoteInput,
  CreateTestimonialInput,
} from './interfaces/testimonial.interface';

@Injectable()
export class TestimonialRepository {
  constructor(private readonly prisma: PrismaService) {}

  //addd Methods, get, delete, update

  async findAll(query: FindAllTestimonialsQuery): Promise<any[]>{
    
    const {orderBy, type, category_id} = query;

    const where : Prisma.TestimonialWhereInput = {}

    if(category_id) where.category_id = category_id
    if(type) where.type = type as any

    return this.prisma.client.testimonial.findMany({
      where,
      orderBy: orderBy ?? { created_at: 'desc' }
    })
  }


  async createQuote(quote: CreateQuoteInput) {

    await await this.prisma.client.testimonial.create({
      data: {
        ...quote,
      },
    });
  }

  async createTestimonial(testimonial: CreateTestimonialInput) {
        console.log("repo", testimonial)
    await await this.prisma.client.testimonial.create({
      data: {
        ...testimonial,
      },
    });
  }
}
