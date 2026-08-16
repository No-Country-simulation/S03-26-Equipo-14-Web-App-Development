import { ConflictException, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import env from '@repo/env';
import { EmbedRepository, Testimonial, TestimonialType } from '@repo/api';
import { FindAllDto } from './dto/findAll.dto';
import { test } from '@jest/globals';

@Injectable()
export class EmbedService {
  constructor(private readonly api: EmbedRepository) {}

  async getPublishedTestimonials(
    type: string,
    credentials: FindAllDto,
  ): Promise<Testimonial[]> {
    const isVerify = await this.api.verifyProject(credentials);

    if (!isVerify)
      throw new ConflictException(
        'This project is not affiliated with the organization',
      );

    const testimonials = await this.api.findAllPublishedTestimonials(
      credentials.projectId,
      type as TestimonialType,
    );

    return testimonials;
  }

  async decodeApiKey(
    apiKey: string,
  ): Promise<{ projectId: string; orgId: string }> {
    
    const payload = this.decrypt(apiKey);
    return JSON.parse(payload);
  }

  decrypt(text: string): string {
    
    const [prefix, ivHex, encryptedHex] = text.split(':');

    if (!prefix || !ivHex || !encryptedHex) {
      throw new Error('Invalid apiKey format');
    }

    const iv = Buffer.from(ivHex, 'base64url');
    const encrypted = Buffer.from(encryptedHex, 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-cbc', env.AES_SECRET, iv);
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString();
  }
}
