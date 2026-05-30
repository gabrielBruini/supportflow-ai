import { MessageResponse } from './message-response.dto';
import { TicketResponse } from './ticket-response.dto';

export interface ConversationResponse {
  ticket: TicketResponse;
  messages: MessageResponse[];
}
