import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetConversationDto } from '@shared/contracts/ticket/get-conversation.dto';
import { ConversationResponse } from '@shared/contracts/ticket/conversation-response.dto';
import { GetConversationService } from './services/get-conversation.service';
import { TICKET_PATTERNS } from '@shared/constants';

@Controller()
export class ConversationsController {
  constructor(
    private readonly getConversationService: GetConversationService,
  ) {}

  @MessagePattern(TICKET_PATTERNS.GET_CONVERSATION)
  async getConversation(
    @Payload() dto: GetConversationDto,
  ): Promise<ConversationResponse> {
    return this.getConversationService.execute(dto);
  }
}
