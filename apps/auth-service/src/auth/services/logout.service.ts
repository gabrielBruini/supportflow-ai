import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { LogoutDto } from '@shared/contracts/auth/logout.dto';
import { RedisService } from '../../database/redis/redis.service';

@Injectable()
export class LogoutService {
  constructor(private readonly redis: RedisService) {}

  async execute(dto: LogoutDto): Promise<{ message: string }> {
    const key = `refresh_token:${dto.refreshToken}`;
    const userId = await this.redis.get(key);

    if (!userId) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid refresh token',
      });
    }

    await this.redis.del(key);
    return { message: 'Logged out successfully' };
  }
}
