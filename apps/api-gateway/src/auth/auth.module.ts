import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUES } from '@shared/constants/queues';
import { SERVICES } from '@shared/constants/services';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICES.AUTH,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.getOrThrow<string>('rabbitmq.url')],
            queue: QUEUES.AUTH,
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware],
  exports: [JwtModule, AuthMiddleware],
})
export class AuthModule {}
