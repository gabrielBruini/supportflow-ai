import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './config/env.config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './auth/database/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
      envFilePath: 'apps/auth-service/.env',
    }),
    RedisModule,
    AuthModule,
  ],
})
export class AppModule {}
