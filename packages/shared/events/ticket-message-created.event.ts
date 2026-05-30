import { MessageResponse } from '../contracts/ticket/message-response.dto';

export class TicketMessageCreatedEvent {
  readonly eventType = 'ticket.message.created';
  readonly occurredAt: Date;

  constructor(public readonly message: MessageResponse) {
    this.occurredAt = new Date();
  }
}
