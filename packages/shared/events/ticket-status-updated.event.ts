import { TicketStatus } from '@shared/contracts/ticket/ticket.enums';

export class TicketStatusUpdatedEvent {
  readonly eventType = 'ticket.status.updated';
  readonly occurredAt: Date;

  constructor(
    public readonly ticketId: string,
    public readonly previousStatus: TicketStatus,
    public readonly newStatus: TicketStatus,
    public readonly updatedBy?: string,
  ) {
    this.occurredAt = new Date();
  }
}
