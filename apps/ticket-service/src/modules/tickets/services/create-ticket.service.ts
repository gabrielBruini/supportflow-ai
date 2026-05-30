import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from '@shared/contracts/ticket/create-ticket.dto';
import { TicketResponse } from '@shared/contracts/ticket/ticket-response.dto';
import { PrismaService } from '../../../database/prisma.service';
import { TicketEventsPublisher } from '../../../events/ticket-events.publisher';
import { TicketMapper } from '../mappers/ticket.mapper';
import { TicketCreatedEvent } from '@shared/events';

@Injectable()
export class CreateTicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsPublisher: TicketEventsPublisher,
  ) {}

  async execute(dto: CreateTicketDto): Promise<TicketResponse> {
    const ticket = await this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        customerId: dto.customerId,
        assignedTo: dto.assignedTo,
      },
    });

    const response = TicketMapper.toResponse(ticket);
    this.eventsPublisher.publishTicketCreated(new TicketCreatedEvent(response));

    return response;
  }
}
