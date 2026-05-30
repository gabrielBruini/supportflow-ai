import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EXCHANGES } from '@shared/constants';
import { SERVICES } from '@shared/constants/services';
import { AuthController } from './auth.controller';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { RegisterUserService } from './services/register-user.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('jwt.secret'),
        signOptions: { expiresIn: config.getOrThrow('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: SERVICES.AUTH_EVENTS_CLIENT,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.getOrThrow<string>('rabbitmq.url')],
            exchange: EXCHANGES.AUTH_EVENTS,
            exchangeType: 'topic',
            wildcards: true,
            noAck: true,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    LoginService,
    RegisterUserService,
    LogoutService,
    RefreshTokenService,
    UserRepository,
  ],
})
export class AuthModule {}
