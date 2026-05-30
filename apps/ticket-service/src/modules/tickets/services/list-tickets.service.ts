import { Injectable } from '@nestjs/common';
import { ListTicketsDto } from '@shared/contracts/ticket/list-tickets.dto';
import {
  PaginatedTicketsResponse,
  TicketResponse,
} from '@shared/contracts/ticket/ticket-response.dto';
import { PrismaService } from '../../../database/prisma.service';
import { TicketMapper } from '../mappers/ticket.mapper';

@Injectable()
export class ListTicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: ListTicketsDto): Promise<PaginatedTicketsResponse> {
    const page = dto.page;
    const limit = dto.limit;
    const skip = (page - 1) * limit;

    const where = {
      ...(dto.customerId && { customerId: dto.customerId }),
      ...(dto.assignedTo && { assignedTo: dto.assignedTo }),
      ...(dto.status && { status: dto.status }),
      ...(dto.priority && { priority: dto.priority }),
    };

    const [tickets, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      data: tickets.map((t): TicketResponse => TicketMapper.toResponse(t)),
      total,
      page,
      limit,
    };
  }
}
