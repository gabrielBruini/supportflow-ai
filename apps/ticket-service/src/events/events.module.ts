import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EXCHANGES } from '@shared/constants/queues';
import { SERVICES } from '@shared/constants/services';
import { TicketEventsPublisher } from './ticket-events.publisher';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICES.TICKET_EVENTS_CLIENT,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.getOrThrow<string>('rabbitmq.url')],
            exchange: EXCHANGES.TICKET_EVENTS,
            exchangeType: 'topic',
            wildcards: true,
            noAck: true,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [TicketEventsPublisher],
  exports: [TicketEventsPublisher],
})
export class EventsModule {}
