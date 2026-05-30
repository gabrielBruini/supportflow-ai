import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TicketsGateway } from './tickets.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TicketsGateway],
  exports: [TicketsGateway],
})
export class WebSocketModule {}
