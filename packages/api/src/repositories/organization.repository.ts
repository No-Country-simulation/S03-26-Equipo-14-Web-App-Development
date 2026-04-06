import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.client.organization.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.client.organization.findFirst({
      where: {
        id,
      },
    });
  }

  async findById(id: string) {
    try {
      const org = await this.prisma.client.organization.findUnique({
        where: { id },
      });

      if (org == null)
        throw new NotFoundException(
          "The Organization isn't in our DB. Try with another id. Have a great day!",
        );
      return org;
    } catch (error: any | Error) {
      throw new ConflictException(error);
    }
  }
}
