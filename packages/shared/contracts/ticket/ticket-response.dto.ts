import { TicketPriority, TicketStatus } from './ticket.enums';

export interface TicketResponse {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: string;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTicketsResponse {
  data: TicketResponse[];
  total: number;
  page: number;
  limit: number;
}
