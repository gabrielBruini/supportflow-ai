import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TICKET_PATTERNS } from '@shared/constants/ticket-patterns';
import { CreateMessageDto } from '@shared/contracts/ticket/create-message.dto';
import { MessageResponse } from '@shared/contracts/ticket/message-response.dto';
import { CreateMessageService } from './services/create-message.service';

@Controller()
export class MessagesController {
  constructor(private readonly createMessageService: CreateMessageService) {}

  @MessagePattern(TICKET_PATTERNS.ADD_MESSAGE)
  async addMessage(@Payload() dto: CreateMessageDto): Promise<MessageResponse> {
    return this.createMessageService.execute(dto);
  }
}
