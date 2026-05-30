import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@shared/constants/services';
import { TICKET_EVENTS } from '@shared/constants/ticket-patterns';
import { TicketCreatedEvent } from '@shared/events/ticket-created.event';
import { TicketMessageCreatedEvent } from '@shared/events/ticket-message-created.event';
import { TicketStatusUpdatedEvent } from '@shared/events/ticket-status-updated.event';

@Injectable()
export class TicketEventsPublisher {
  constructor(
    @Inject(SERVICES.TICKET_EVENTS_CLIENT)
    private readonly client: ClientProxy,
  ) {}

  publishTicketCreated(event: TicketCreatedEvent): void {
    this.client.emit(TICKET_EVENTS.CREATED, event);
  }

  publishMessageCreated(event: TicketMessageCreatedEvent): void {
    this.client.emit(TICKET_EVENTS.MESSAGE_CREATED, event);
  }

  publishStatusUpdated(event: TicketStatusUpdatedEvent): void {
    this.client.emit(TICKET_EVENTS.STATUS_UPDATED, event);
  }
}
