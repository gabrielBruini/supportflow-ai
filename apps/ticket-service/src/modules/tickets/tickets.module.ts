import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { CreateTicketService } from './services/create-ticket.service';
import { GetTicketService } from './services/get-ticket.service';
import { ListTicketsService } from './services/list-tickets.service';
import { UpdateTicketStatusService } from './services/update-ticket-status.service';

@Module({
  controllers: [TicketsController],
  providers: [
    CreateTicketService,
    ListTicketsService,
    GetTicketService,
    UpdateTicketStatusService,
  ],
})
export class TicketsModule {}
