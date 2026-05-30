import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GetTicketDto } from '@shared/contracts/ticket/get-ticket.dto';
import { TicketResponse } from '@shared/contracts/ticket/ticket-response.dto';
import { PrismaService } from '../../../database/prisma.service';
import { TicketMapper } from '../mappers/ticket.mapper';

@Injectable()
export class GetTicketService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GetTicketDto): Promise<TicketResponse> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: dto.id },
    });

    if (!ticket) {
      throw new RpcException({ statusCode: 404, message: 'Ticket not found' });
    }

    return TicketMapper.toResponse(ticket);
  }
}
