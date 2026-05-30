import { TicketResponse } from '../contracts/ticket/ticket-response.dto';

export class TicketCreatedEvent {
  readonly eventType = 'ticket.created';
  readonly occurredAt: Date;

  constructor(public readonly ticket: TicketResponse) {
    this.occurredAt = new Date();
  }
}
