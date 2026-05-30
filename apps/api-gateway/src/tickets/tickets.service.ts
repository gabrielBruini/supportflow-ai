import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@shared/constants/services';
import { TICKET_PATTERNS } from '@shared/constants/ticket-patterns';
import { CreateTicketDto } from '@shared/contracts/ticket/create-ticket.dto';
import { CreateMessageDto } from '@shared/contracts/ticket/create-message.dto';
import { GetConversationDto } from '@shared/contracts/ticket/get-conversation.dto';
import { GetTicketDto } from '@shared/contracts/ticket/get-ticket.dto';
import { ListTicketsDto } from '@shared/contracts/ticket/list-tickets.dto';
import { UpdateTicketStatusDto } from '@shared/contracts/ticket/update-ticket-status.dto';
import { ConversationResponse } from '@shared/contracts/ticket/conversation-response.dto';
import { MessageResponse } from '@shared/contracts/ticket/message-response.dto';
import {
  PaginatedTicketsResponse,
  TicketResponse,
} from '@shared/contracts/ticket/ticket-response.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketsService {
  constructor(@Inject(SERVICES.TICKET) private readonly client: ClientProxy) {}

  async create(dto: CreateTicketDto): Promise<TicketResponse> {
    return firstValueFrom(
      this.client.send<TicketResponse>(TICKET_PATTERNS.CREATE, dto),
    );
  }

  async list(dto: ListTicketsDto): Promise<PaginatedTicketsResponse> {
    return firstValueFrom(
      this.client.send<PaginatedTicketsResponse>(TICKET_PATTERNS.LIST, dto),
    );
  }

  async getById(dto: GetTicketDto): Promise<TicketResponse> {
    return firstValueFrom(
      this.client.send<TicketResponse>(TICKET_PATTERNS.GET_BY_ID, dto),
    );
  }

  async updateStatus(dto: UpdateTicketStatusDto): Promise<TicketResponse> {
    return firstValueFrom(
      this.client.send<TicketResponse>(TICKET_PATTERNS.UPDATE_STATUS, dto),
    );
  }

  async addMessage(dto: CreateMessageDto): Promise<MessageResponse> {
    return firstValueFrom(
      this.client.send<MessageResponse>(TICKET_PATTERNS.ADD_MESSAGE, dto),
    );
  }

  async getConversation(
    dto: GetConversationDto,
  ): Promise<ConversationResponse> {
    return firstValueFrom(
      this.client.send<ConversationResponse>(
        TICKET_PATTERNS.GET_CONVERSATION,
        dto,
      ),
    );
  }
}
