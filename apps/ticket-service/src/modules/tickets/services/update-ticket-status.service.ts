import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UpdateTicketStatusDto } from '@shared/contracts/ticket/update-ticket-status.dto';
import { TicketResponse } from '@shared/contracts/ticket/ticket-response.dto';
import { TicketStatusUpdatedEvent } from '@shared/events/ticket-status-updated.event';
import { PrismaService } from '../../../database/prisma.service';
import { TicketEventsPublisher } from '../../../events/ticket-events.publisher';
import { TicketMapper } from '../mappers/ticket.mapper';
import { TicketStatus } from '@shared/contracts/ticket/ticket.enums';

@Injectable()
export class UpdateTicketStatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsPublisher: TicketEventsPublisher,
  ) {}

  async execute(dto: UpdateTicketStatusDto): Promise<TicketResponse> {
    const existing = await this.prisma.ticket.findUnique({
      where: { id: dto.ticketId },
    });

    if (!existing) {
      throw new RpcException({ statusCode: 404, message: 'Ticket not found' });
    }

    const updated = await this.prisma.ticket.update({
      where: { id: dto.ticketId },
      data: { status: dto.status },
    });

    const response = TicketMapper.toResponse(updated);

    this.eventsPublisher.publishStatusUpdated(
      new TicketStatusUpdatedEvent(
        updated.id,
        TicketMapper.toResponse(existing).status as TicketStatus,
        response.status as TicketStatus,
        dto.updatedBy,
      ),
    );

    return response;
  }
}
