import { ConflictException, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import env from '@repo/env';
import { EmbedRepository, Testimonial } from '@repo/api';
import { FindAllDto } from './dto/findAll.dto';

@Injectable()
export class EmbedService {
  constructor(private readonly api: EmbedRepository) {}

  async getPublishedTestimonials(
    credentials: FindAllDto,
  ): Promise<Testimonial[]> {
    const isVerify = await this.api.verifyProject(credentials);

    if (!isVerify)
      throw new ConflictException(
        'This project is not affiliated with the organization',
      );

    const testimonials = await this.api.findAllPublishedTestimonials(
      credentials.projectId,
    );

    return testimonials;
  }

  async decodeApiKey(
    apiKey: string,
  ): Promise<{ projectId: string; orgId: string }> {
    //used in embeding system
    const payload = this.decrypt(apiKey);
    return JSON.parse(payload);
  }

  decrypt(text: string): string {
    //used in embeding system
    const [prefix, ivHex, encryptedHex] = text.split(':');

    if (prefix || !ivHex || !encryptedHex) {
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
