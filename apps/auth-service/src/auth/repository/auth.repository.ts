import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { Prisma, User } from 'apps/auth-service/generated/prisma';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User> {
    const result = await this.prisma.user.findUnique({ where: { email } });

    if (!result) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }
    return result;
  }

  async findById(id: string): Promise<User> {
    const result = await this.prisma.user.findUnique({ where: { id } });

    if (!result) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }

    return result;
  }

  async existByEmail(email: string): Promise<boolean> {
    const result = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!result) {
      return false;
    }

    return true;
  }
}
