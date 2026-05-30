import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './config/env.config';
import { PrismaModule } from './database/prisma.module';
import { EventsModule } from './events/events.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { TicketsModule } from './modules/tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
      envFilePath: 'apps/ticket-service/.env',
    }),
    PrismaModule,
    EventsModule,
    TicketsModule,
    MessagesModule,
    ConversationsModule,
  ],
})
export class AppModule {}
