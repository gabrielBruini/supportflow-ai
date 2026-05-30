import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { GetConversationService } from './services/get-conversation.service';

@Module({
  controllers: [ConversationsController],
  providers: [GetConversationService],
})
export class ConversationsModule {}
