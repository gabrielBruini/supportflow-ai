import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from '@shared/contracts/auth/login.dto';
import { LoginResponse } from '@shared/contracts/auth/login-response.dto';
import bcrypt from 'bcryptjs';
import { RedisService } from '../database/redis/redis.service';
import { UserRepository } from '../repository/auth.repository';

const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (await bcrypt.compare(dto.password, user.password)) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = crypto.randomUUID();
    await this.redis.set(
      `refresh_token:${refreshToken}`,
      user.id,
      REFRESH_TOKEN_TTL_SECONDS,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
