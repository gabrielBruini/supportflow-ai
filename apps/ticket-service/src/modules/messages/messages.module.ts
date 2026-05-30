import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { CreateMessageService } from './services/create-message.service';

@Module({
  controllers: [MessagesController],
  providers: [CreateMessageService],
})
export class MessagesModule {}
