import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GetConversationDto } from '@shared/contracts/ticket/get-conversation.dto';
import { ConversationResponse } from '@shared/contracts/ticket/conversation-response.dto';
import { PrismaService } from '../../../database/prisma.service';
import { MessageMapper } from '../../messages/mappers/message.mapper';
import { TicketMapper } from '../../tickets/mappers/ticket.mapper';

@Injectable()
export class GetConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GetConversationDto): Promise<ConversationResponse> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: dto.ticketId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new RpcException({ statusCode: 404, message: 'Ticket not found' });
    }

    return {
      ticket: TicketMapper.toResponse(ticket),
      messages: ticket.messages.map((m) => MessageMapper.toResponse(m)),
    };
  }
}
