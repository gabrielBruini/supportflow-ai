import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@auth-service/generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return result !== null;
  }
}
