import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTicketDto } from '@shared/contracts/ticket/create-ticket.dto';
import { GetTicketDto } from '@shared/contracts/ticket/get-ticket.dto';
import { ListTicketsDto } from '@shared/contracts/ticket/list-tickets.dto';
import { UpdateTicketStatusDto } from '@shared/contracts/ticket/update-ticket-status.dto';
import {
  PaginatedTicketsResponse,
  TicketResponse,
} from '@shared/contracts/ticket/ticket-response.dto';
import { CreateTicketService } from './services/create-ticket.service';
import { GetTicketService } from './services/get-ticket.service';
import { ListTicketsService } from './services/list-tickets.service';
import { UpdateTicketStatusService } from './services/update-ticket-status.service';
import { TICKET_PATTERNS } from '@shared/constants';

@Controller()
export class TicketsController {
  constructor(
    private readonly createTicketService: CreateTicketService,
    private readonly listTicketsService: ListTicketsService,
    private readonly getTicketService: GetTicketService,
    private readonly updateTicketStatusService: UpdateTicketStatusService,
  ) {}

  @MessagePattern(TICKET_PATTERNS.CREATE)
  async create(@Payload() dto: CreateTicketDto): Promise<TicketResponse> {
    return this.createTicketService.execute(dto);
  }

  @MessagePattern(TICKET_PATTERNS.LIST)
  async list(
    @Payload() dto: ListTicketsDto,
  ): Promise<PaginatedTicketsResponse> {
    return this.listTicketsService.execute(dto);
  }

  @MessagePattern(TICKET_PATTERNS.GET_BY_ID)
  async getById(@Payload() dto: GetTicketDto): Promise<TicketResponse> {
    return this.getTicketService.execute(dto);
  }

  @MessagePattern(TICKET_PATTERNS.UPDATE_STATUS)
  async updateStatus(
    @Payload() dto: UpdateTicketStatusDto,
  ): Promise<TicketResponse> {
    return this.updateTicketStatusService.execute(dto);
  }
}
