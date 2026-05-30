import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateMessageDto } from '@shared/contracts/ticket/create-message.dto';
import { MessageResponse } from '@shared/contracts/ticket/message-response.dto';
import { TicketMessageCreatedEvent } from '@shared/events/ticket-message-created.event';
import { PrismaService } from '../../../database/prisma.service';
import { TicketEventsPublisher } from '../../../events/ticket-events.publisher';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class CreateMessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsPublisher: TicketEventsPublisher,
  ) {}

  async execute(dto: CreateMessageDto): Promise<MessageResponse> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: dto.ticketId },
    });

    if (!ticket) {
      throw new RpcException({ statusCode: 404, message: 'Ticket not found' });
    }

    const message = await this.prisma.message.create({
      data: {
        ticketId: dto.ticketId,
        senderId: dto.senderId,
        senderType: dto.senderType,
        content: dto.content,
      },
    });

    const response = MessageMapper.toResponse(message);
    this.eventsPublisher.publishMessageCreated(new TicketMessageCreatedEvent(response));

    return response;
  }
}
