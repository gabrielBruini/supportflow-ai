import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { RefreshTokenDto } from '@shared/contracts/auth/refresh-token.dto';
import { RefreshTokenResponse } from '@shared/contracts/auth/refresh-token-response.dto';
import { RedisService } from '../database/redis/redis.service';
import { UserRepository } from '../repository/auth.repository';

const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    const key = `refresh_token:${dto.refreshToken}`;
    const userId = await this.redis.get(key);

    if (!userId) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid refresh token',
      });
    }

    const user = await this.userRepository.findById(userId);

    await this.redis.del(key);
    const newRefreshToken = crypto.randomUUID();
    await this.redis.set(
      `refresh_token:${newRefreshToken}`,
      user.id,
      REFRESH_TOKEN_TTL_SECONDS,
    );

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
