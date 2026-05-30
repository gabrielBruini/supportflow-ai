import { Ticket } from '@ticket-service/generated/prisma';
import {
  TicketPriority,
  TicketStatus,
} from '@shared/contracts/ticket/ticket.enums';
import { TicketResponse } from '@shared/contracts/ticket/ticket-response.dto';

export class TicketMapper {
  static toResponse(ticket: Ticket): TicketResponse {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status as unknown as TicketStatus,
      priority: ticket.priority as unknown as TicketPriority,
      customerId: ticket.customerId,
      assignedTo: ticket.assignedTo,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}
